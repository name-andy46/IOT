
let deviceId = '';
let access_token = '';


document.addEventListener('DOMContentLoaded', function () {

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    access_token = userInfo.access;

    
    if (access_token == '') {
        const auth_info = document.querySelector('#device_name');
        
        let msg = createNode('h1');
        msg.innerText = 'You need to log in';
        append(auth_info, msg)

        return
    }

    showUser();

    deviceId = JSON.parse(document.querySelector('#device_id').textContent);
    

    const search_form = document.querySelector('#search');
    search_form.addEventListener('input', (event) => {

        if (event.target.name == 'date_filter') {
            getLogs(deviceId);
        }

    })

    const filterBtn = document.querySelector('#filter_reset');
    filterBtn.addEventListener('click', () => {
        
        const start_date = document.querySelector('#start_range');
        start_date.value = '';

        const end_date = document.querySelector('#end_range');
        end_date.value = '';
        
        getLogs(deviceId);
    })



    getLogs(deviceId);

});

const showUser = () => {
    const name = JSON.parse(localStorage.getItem('userName'))
    document.querySelector('#current_user').innerText = name;
}

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



const getLogs = async (deviceId) => {

    const csrftoken = getCookie('csrftoken');
    // new Date(x.value).getTime()

    // const start_date = document.querySelector('#start_range');
    // let start = start_date.value;
    // if (start == '') {
    //     start = 0
    // }
    // start = new Date(start).getTime();
    
    // const end_date = document.querySelector('#end_range');
    // let end = end_date.value;
    // if (end == '') {
    //     end = new Date().getTime();
    // }
    // end = new Date(end).getTime();
    
    const start_date = document.querySelector('#start_range');
    let start = start_date.value;
    if (start == '') {
        start = 0
    }
    start = new Date(start).getTime();
    start = parseInt(start / 1000);
    
    const end_date = document.querySelector('#end_range');
    let end = end_date.value;
    if (end == '') {
        end = new Date().getTime();
    }
    end = new Date(end).getTime();
    end = parseInt(end / 1000);

    const response = await fetch(`/api/device/${deviceId}/${start}/${end}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'X-CSRFToken': csrftoken,
            Authorization: `Bearer ${access_token}`
        }
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
        alert('error');
        throw new Error('Could not get logs');
    } else {
        // alert('success');
        renderLogs(data);
    }
}

const formatdate = string => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour12: false }
    return new Date(string).toLocaleTimeString(undefined, options)
}


const renderLogs = data => {
    const temp_body = document.querySelector('#temperature_table');
    temp_body.innerHTML = '';

    const pres_body = document.querySelector('#pressure_table');
    pres_body.innerHTML = '';

    const device = document.querySelector('#device_name');
    device.innerText = data.device_name;

    data.temp_logs.map(temp => {
        // console.log(device.user);
        let tr = createNode('tr');

        let th = createNode('th');
        th.innerHTML = temp.id;
        append(tr, th);

        let temperature = createNode('td');
        temperature.innerHTML = temp.temperature;
        append(tr, temperature);

        let time = createNode('td');
        time.innerHTML = formatdate(temp.log_time);
        append(tr, time);


        append(temp_body, tr);

    })

    data.pres_logs.map(pres => {
        // console.log(device.user);
        let tr = createNode('tr');

        let th = createNode('th');
        th.innerHTML = pres.id;
        append(tr, th);

        let pressure = createNode('td');
        pressure.innerHTML = pres.pressure;
        append(tr, pressure);

        let time = createNode('td');
        time.innerHTML = formatdate(pres.log_time);
        append(tr, time);


        append(pres_body, tr);

    })
}

