async function login(formData) {
    const endpoint = "login";
    
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    const body = {
        username : username,
        password : password
    };

    const params = {
        headers : {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(body),
        method : "POST"
    };

    let response = await customFetch(endpoint, params);
    processResp(response);
    
}


async function processResp(response) {
    console.log(response)
    if (response["isSuccessful"]==true){
        localStorage.setItem("access_token", response.jwt);

        const role = response["role"];
        const username = response["username"];

        if (role=="admin"){
            window.location.replace("/html/admin/admin.html");
        }
        else if (role=="sm"){
            window.location.replace("/html/sm/sm.html")
        }
        else if (role=="passenger"){
            // load passenger home page
            window.location.replace("/html/passenger/home.html");
        }

    }
    else {
        window.alert("Username or password incorrect. Please try again!");
        document.getElementById("signin-form").reset();
    }
}