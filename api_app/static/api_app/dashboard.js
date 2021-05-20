
let access_token = '';
let addDeviceModal = '';

let addBtn = '';
let updateBtn = '';


document.addEventListener('DOMContentLoaded', function () {

    const table_listener = document.querySelector('#device_list_table');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo != null) {
        access_token = userInfo.access;
    }

    if (access_token == '') {
        console.log(true);
        let msg = createNode('h1');
        msg.innerText = 'You need to log in';
        append(table_listener, msg)

        return
    }

    addBtn = document.querySelector('#add_btn');
    updateBtn = document.querySelector('#update_btn');

    const addDeviceHTML = document.querySelector('#addDeviceModal');
    addDeviceModal = new bootstrap.Modal(addDeviceHTML, {backdrop: 'static'});

    
    dashboard(access_token);

    // document.querySelector('#addDeviceForm').addEventListener('submit', addDeviceFunc(access_token));
    document.querySelector('#addDeviceForm').addEventListener('submit', (event) => {
        if (event.submitter.id == 'add_btn') {
            addDeviceFunc(event, access_token);
        }
        
        if (event.submitter.id == 'update_btn') {
            updateDeviceFunc(event, access_token, event.submitter.value);
        }
    });

    const button_container_listener = document.querySelector('#add_device_open_modal');
    button_container_listener.addEventListener('click', (event) => {
        
        addBtn.style.display = '';
        updateBtn.style.display = 'none';
        addDeviceModal.show();
    })


    

    table_listener.addEventListener('click', (event) => {
        if(event.target.name == 'update') {
            update_device(event.target.value);
        }
        
        if(event.target.name == 'log_temperature') {
            logTemperatureData(event.target.value);
        }
        
        if(event.target.name == 'log_pressure') {
            logPressureData(event.target.value);
        }
    })


});


function createNode(element) {
    return document.createElement(element)
}
  
  
function append(parent, el) {
    return parent.appendChild(el)
}



function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



const dashboard = async (token) => {

    const csrftoken = getCookie('csrftoken');

    const login_response = await fetch('/api/dash_info/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'X-CSRFToken': csrftoken,
            Authorization: `Bearer ${token}`
        }
    });

    const data = await login_response.json();
    // console.log(data);

    if (!login_response.ok) {
        alert('error');
        throw new Error('Could not get user');
    } else {
        showUser(data.name);
        showDevices(data.device_list);
    }
}


const showDevices = device_list => {
    const table_body = document.querySelector('#device_list_table');
    table_body.innerHTML = '';

    let url = JSON.parse(document.querySelector('#url_device_page').textContent);
    let url_base = url.split('device_id')[0];

    device_list.map(device => {
        let tr = createNode('tr');

        let th = createNode('th');
        th.innerHTML = device.id;
        append(tr, th);

        let name = createNode('td');
        name.innerHTML = device.name;
        name.id = `name_${device.id}`;
        append(tr, name);

        let edit_td = createNode('td');
        let edit = createNode('button');
        edit.value = device.id;
        edit.className = 'btn btn-sm btn-secondary';
        edit.innerHTML = 'Edit Name';
        edit.name = 'update';
        append(edit_td, edit);
        append(tr, edit_td);

        let view_td = createNode('td');
        let view = createNode('a');
        view.value = device.id;
        view.className = 'btn btn-sm btn-primary';
        view.innerHTML = 'View Device Data';
        view.name = 'view_device';
        view.href = `${url_base}${device.id}/`
        append(view_td, view);
        append(tr, view_td);
        
        let action_temp = createNode('td');
        let tempBtn = createNode('button');
        tempBtn.value = device.id;
        tempBtn.className = 'btn btn-sm btn-success';
        tempBtn.innerHTML = 'Log Temperature';
        tempBtn.name = 'log_temperature'
        append(action_temp, tempBtn);
        append(tr, action_temp);
        
        let action_pres = createNode('td');
        let presBtn = createNode('button');
        presBtn.value = device.id;
        presBtn.className = 'btn btn-sm btn-success';
        presBtn.innerHTML = 'Log Pressure';
        presBtn.name = 'log_pressure'
        append(action_pres, presBtn);
        append(tr, action_pres);

        append(table_body, tr);

    })
}


const showUser = name => {
    localStorage.setItem('userName', JSON.stringify(name));
    document.querySelector('#current_user').innerText = name;
}


const addDeviceFunc = async (event, token) => {
    event.preventDefault();

    let name = document.querySelector('#device_name');
    
    if (name.value == '') {
        alert('Name cannot be empty!');
        return
    }

    const csrftoken = getCookie('csrftoken');

    const add_device_response = await fetch('/api/add/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'X-CSRFToken': csrftoken,
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name.value
        })
    });

    const data = await add_device_response.json();

    if (!add_device_response.ok) {
        alert('error');
        throw new Error('Could not add device');
    } else {
        name.value = '';
        alert('success');
        console.log(data)
        addDeviceModal.hide();
        // showUser(login_data);
        dashboard(access_token);
    }

}


const update_device = deviceId => {
    
    const textValue = document.querySelector('#device_name');
    const name = document.querySelector(`#name_${deviceId}`).innerText;
    textValue.value = name;
    
    addDeviceModal.show()
    addBtn.style.display = 'none';
    updateBtn.style.display = '';
    updateBtn.value = deviceId;
}


const updateDeviceFunc = async (event, token, deviceId) => {
    event.preventDefault();

    // alert(deviceId);

    let name = document.querySelector('#device_name');
    
    if (name.value == '') {
        alert('Name cannot be empty!');
        return
    }

    const csrftoken = getCookie('csrftoken');

    const update_device_response = await fetch('/api/update/', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'X-CSRFToken': csrftoken,
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name.value,
            id: deviceId
        })
    });

    const data = await update_device_response.json();

    if (!update_device_response.ok) {
        alert('error');
        throw new Error('Could not update device name');
    } else {
        name.value = '';
        alert('success');
        console.log(data)
        addDeviceModal.hide();
        // showUser(login_data);
        dashboard(access_token);
    }
}



const logTemperatureData = async (deviceId) => {

    const csrftoken = getCookie('csrftoken');

    const log_response = await fetch('/api/temperature/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'X-CSRFToken': csrftoken,
            Authorization: `Bearer ${access_token}`
        },
        body: JSON.stringify({
            device_id: deviceId
        })
    });

    const data = await log_response.json();

    if (!log_response.ok) {
        alert('error');
        throw new Error('Could not log temperature data');
    } else {
        alert('logged temperature');
        // console.log(data)
    }

}


const logPressureData = async (deviceId) => {

    const csrftoken = getCookie('csrftoken');

    const log_response = await fetch('/api/pressure/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'X-CSRFToken': csrftoken,
            Authorization: `Bearer ${access_token}`
        },
        body: JSON.stringify({
            device_id: deviceId
        })
    });

    const data = await log_response.json();

    if (!log_response.ok) {
        alert('error');
        throw new Error('Could not log pressure data');
    } else {
        alert('logged pressure');
        // console.log(data)
    }

}