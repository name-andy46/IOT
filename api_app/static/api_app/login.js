



document.addEventListener('DOMContentLoaded', function () {



});


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



const loginHandler = async () => {
    // event.preventDefault();

    const usrn = document.querySelector('#username');
    const pwd = document.querySelector('#password');

    const csrftoken = getCookie('csrftoken');
    let access_token ='';

    const token_response = await fetch(`/api/token/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            username: usrn.value,
            password: pwd.value,
        })

    });

    const token_data = await token_response.json();
    access_token = await token_data.access;

    if (!token_response.ok) {
        alert('error');
        throw new Error('Invalid User Credentials!');
    } else {
        alert('success');
        localStorage.setItem('userInfo', JSON.stringify(token_data));
        window.location.replace('/api');
        // dashboard(access_token);
    }





    // fetch(`/api/token/`, {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json; charset=utf8',
    //         'X-CSRFToken': csrftoken,
    //     },
    //     body: JSON.stringify({
    //         username: usrn,
    //         password: pwd
    //     })

    // }).then(response => {


    //     if (!response.ok) {
    //         alert('error');
    //         throw new Error('Invalid User Credentials!');
    //     }

    //     const data = response.json();
    //     return data
    // }).then(data => {

    //     console.log(data);
    //     alert('success');

    //     localStorage.setItem('userInfo', JSON.stringify(data));

    // }).catch(error => {

    //     console.log(error);
    // })


};

// const dashboard = async (token) => {

//     const csrftoken = getCookie('csrftoken');
    
//     const login_response = await fetch('/api/', {
//         method: 'GET',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json; charset=utf8',
//             'X-CSRFToken': csrftoken,
//             Authorization: `Bearer ${token}`
//         }
//     });

//     const login_data = await login_response.json();

//     if (!login_response.ok) {
//         alert('error');
//         throw new Error('Could not login');
//     } else {
//         alert('success');
//         console.log(login_data);
//         // window.location.replace('/api');
//     }
// }