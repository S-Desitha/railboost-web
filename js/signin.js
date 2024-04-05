async function login(formData) {
    console.log("login function called");
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
    processLoginResp(response);
    
}


async function processLoginResp(response) {
    console.log("processLoginResp function called");
    console.log(response)
    if (response["isSuccessful"]==true){
        localStorage.setItem("access_token", response.jwt);
        localStorage.setItem("name", response["name"]);
        localStorage.setItem("loggedIn", response["isSuccessful"]);
        const role = response["role"].roleId;
        const username = response["username"];

        if (role==1){
            window.location.replace("/html/admin/admin.html");
        }
        else if (role==3){
            window.location.replace("/html/sm/sm.html")
        }
        else if (role==5){
            // load passenger home page
            window.location.replace("/html/passenger/home.html");
        }

    }
    else {
        window.alert("Username or password incorrect. Please try again!");
        document.getElementById("signin-form").reset();
    }
}