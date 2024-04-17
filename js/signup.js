// const url = "http://localhost:8080/railboost_backend_war_exploded/signup";
let endpoint = "signup";
let tempUID;

document.addEventListener("DOMContentLoaded", async () => {
    let form = document.getElementById("form");
    let queryParams = new URLSearchParams(window.location.search);
    tempUID = queryParams.get("tempUID");
    console.log("tempUUID: " +tempUID);
    
    form.reset();

    if (tempUID) {
        form.setAttribute("onsubmit", "staffSignup(); return false;");
        let urlQuery = endpoint +"?tempUID="+ tempUID;
        try {
            let staff = await customFetch(urlQuery, {}, false);
            let user = staff.user;
            console.log(staff);

            let username = document.getElementById("username");
            let fName = document.getElementById("fName");
            let lName = document.getElementById("lName");
            let dob = document.getElementById("dob");
            let gender = document.getElementById("gender");
            let telNo = document.getElementById("phone-field");
            let email = document.getElementById("email-field");
            let role = document.getElementById("role");
            let staffId = document.getElementById("staffId");
            let station = document.getElementById("station");

            username.value = user.username;
            fName.value = user.fName;
            lName.value = user.lName;
            email.value = user.email;
            telNo.value = user.telNo;
            role.value = user.role.role;
            staffId.value = staff.staffId;
            if (staff.station)
                station.value = staff.station;

            username.readonly = true;
            fName.readonly = true;
            lName.readonly = true;
            email.readonly = true;
            role.readonly = true;
            staffId.readonly = true;
            station.readonly = true;

            staffId.style.display = "block";
            role.style.display = "block";
            station.style.display = role.value == "sm" ? "block" : "none";
            dob.style.display = "none";
            dob.required = false;
            gender.style.display = "none";
            gender.required = false;


        } catch(error) {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        }
    }
});



async function signUp() {
    user = {};

    user["username"] = document.getElementById("username").value;
    user["password"] = document.getElementById("password").value;
    user["fName"] = document.getElementById("fName").value;
    user["lName"] = document.getElementById("lName").value;
    user["dob"] = new Date(document.getElementById("dob").value).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    user["gender"] = document.getElementById("gender").value;
    user["email"] = document.getElementById("email-field").value;
    user["role"] = {roleId: 5};

    console.log(user);

    const body = {user: user};
    const params = {
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body : JSON.stringify(body),
        method : "POST"
    };

    let data = await customFetch(endpoint, params, false);
    console.log(data);
    if (user.role.roleId==5) {

    let swalPromise = Swal.fire({
        icon: 'success',
        title: 'Signup Successful!',
        text: 'You will be automatically logged in and redirected to the dashboard.',
        showConfirmButton: true // Show the "OK" button
    });
    
    // Wait for the user to click "OK"
    await swalPromise;

    // Automatically log in after the user clicks "OK"
    await login();

    // fetch(url, params)
    // .then(res => {
    //     if(res.ok) {
    //         window.location.replace("home.html");
    //     }
    // });
    }
}



async function staffSignup() {
    console.log("staff signup");
    staff = {
        tempUID : tempUID,
        user : {
            username : document.getElementById("username").value,
            password : document.getElementById("password").value,
            isStaff : true
        }
    };

    console.log(staff);

    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(staff),
        method : "POST"
    };

    let data = await customFetch(endpoint, params, false);
    console.log(data);
    processLoginResp(data);
}