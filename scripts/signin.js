function login(formData) {
    const url = "http://localhost:8080/railboost_backend_war_exploded/login";
    
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    const body = {
        username : username,
        password : password
    };

    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(body),
        method : "POST",
        credentials : "include"
    };

    fetch(url, params)
    .then(res => processResp(res));
}


async function processResp(res) {
    if(res.ok) {
        const json = res.json()
            .then(response => {
                console.log(response)
                if (response["isSuccessful"]==true){
                    const role = response["role"]
                    if (role=="admin"){
                        window.location.replace("../admin/admin.html");
                    }
                    else if (role=="passenger"){
                        // load passenger home page
                        window.location.replace("home.html");
                    }
                }
                else {
                    window.alert("Username or password incorrect. Please try again!")
                }
            })
    }

    else {
        const text = await res.text();
        console.log("Error: " + text);
        throw new Error(text);
    }    
}