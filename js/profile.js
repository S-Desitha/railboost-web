const endpoint2 = "profile"

document.addEventListener("DOMContentLoaded", async function () {
    // const endpoint3 = "user"
    let params = {
        view: 1,
        userId: localStorage.getItem("userId"),
    };
    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${endpoint2}?${queryString}`;
    
        let data = await customFetch(urlQuery, {credentials: "include"});
        console.log(data);
        console.log(data.fName);

        let editButton = document.getElementById("edit-btn");
        editButton.setAttribute("details", JSON.stringify(data));
        editButton.onclick = editProfile;

        document.getElementById("Username").value=data.username;
        document.getElementById("email").value=data.email;
        document.getElementById("Fname").value=data.fName + " " +data.lName;
        document.getElementById("gen").value=data.gender;
        document.getElementById("homeStation").value=data.homeStation;
        document.getElementById("tel").value=data.telNo;

        document.getElementById("name-c2").textContent = data.fName + " " +data.lName;
        document.getElementById("role-c2").textContent = data.role.role;

        getdp(data.dp);

    
  });

function getdp(dp){
    const endpoint2 = "profile"

    let params = {
        fileName: dp
    };
    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${endpoint2}?${queryString}`;
    console.log(urlQuery);

    customFetch1(urlQuery, {credentials: "include"})
        .then((blob) => {
            if (blob.type && blob.type.includes('image')) {
                const imageUrl = URL.createObjectURL(blob);
                const imgElement = document.getElementById("profile-p");
                imgElement.src = imageUrl;
            }
        })
        .catch((error) => {
            console.error("Error fetching image:", error);
            if (error == "login-redirected") {
                localStorage.setItem("last_url", window.location.pathname);
            }
        });
}

function uploadDP(){
    // user = {};
    // user["userId"] = localStorage.getItem("userId");

    let pp = document.getElementById("profile-p");
    let ip = document.getElementById("dp");
    pp.src = URL.createObjectURL(ip.files[0]);
                    

    const fileInput = document.getElementById("dp");
    const file = fileInput.files[0];

    let formData = new FormData(); 


    // const body = JSON.stringify(user);
    // formData.append("jsonObj",body);
    formData.append("file",file);
    if (file) {
        const params = {
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: formData,
        method: "POST",
        credentials: "include"
        };

        customFetch(endpoint2, params)
        .then(() => window.location())
        .catch ((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });

        setTimeout(delayedFunction, 5000);
        location.reload();

    }
}

function editProfile(){
    popupAddPage('.edit-modal');
    let data = JSON.parse(this.getAttribute("details"));
    console.log(data["fName"]);

    document.getElementById('edit-fname').value = data["fName"];
    document.getElementById('edit-lname').value = data["lName"];
    document.getElementById("homest-edit").innerHTML = data["homeStation"];
    
    // document.getElementById("home").stationcode = data[homeStCode];
    // document.getElementById("home").stationcode = data["homeStation"];
    const homeDiv = document.getElementById('home');
    homeDiv.setAttribute('stationcode',  data["homeStCode"]);
    homeDiv.setAttribute('stationname', data["homeStation"]);
    // const ddd=document.getElementById("home").getAttribute("stationCode");
    // console.log(ddd);
    document.getElementById('edit-email').value = data["email"];
    document.getElementById('editgender').value = data["gender"];
    document.getElementById('edit-telno').value = data["telNo"];

    const button = document.getElementById("editform-submit-button");
    button.setAttribute("details", JSON.stringify(data));
    button.onclick = updateProfile;

    dialog.close();


}

function updateProfile() {
    let user = JSON.parse(this.getAttribute("details"));

    user["fName"] = document.getElementById('edit-fname').value;
    user["lName"] = document.getElementById('edit-lname').value;
    user["homeStCode"] = document.getElementById("home").getAttribute("stationCode");
    user["homeStation"] = document.getElementById("home").getAttribute("stationName");
    user["email"] = document.getElementById('edit-email').value
    user["gender"] = document.getElementById('editgender').value;
    user["telNo"] = document.getElementById('edit-telno').value;

    if(!user["fName"] || !user["lName"] || !user["homeStCode"] || !user["homeStation"] || !user["email"] || !user["gender"] || !user["telNo"]){
        console.log("fill all fields!");
        return;
    }

    const body = user;
    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(body),
        method : "PUT"
    };

    customFetch(endpoint2, params)
        .then(() => window.location.reload())
        .catch ((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });


    console.log(user);
}

function validateEmail() {
    var emailField = document.getElementById("edit-email");
    var emailError = document.getElementById("email-error");
    
    if(!emailField.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
        emailError.innerHTML = "Please enter a valid email address";
        return false;
    }
        emailError.innerHTML = "";
        return true;
}

function validatePhone(){
    var phoneField=document.getElementById("edit-telno");
    var phoneError=document.getElementById("phone-error");
    if(!phoneField.value.match(/^\d{10}$/)){
        phoneError.innerHTML = "<div>Please enter a valid phone number</div>";
        return false;
    }
        phoneError.innerHTML = "";
        return true;
}

// function getCurrentPW(){
//     popupAddPage('.Cpw-modal');
// }


async function checkPW() {
    const endpoint = "login";
    
    let username = localStorage.getItem("username");
    let password = document.getElementById("current-pw").value;

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
    console.log(response);
    if (response){
        var checkpwerror = document.getElementById("checkpw-error");
        checkpwerror.innerHTML = "";
        console.log("ok")
        let dialog = document.getElementById("Cpw-modal");
        dialog.close();
        popupAddPage('.Chng-modal');


    }
    else {
        var checkpwerror = document.getElementById("checkpw-error");
    
        checkpwerror.innerHTML = "Password is incorrect. Please try again!";
        // window.alert("password is incorrect. Please try again!");
        document.getElementById("checkpw_form").reset();
    }
    
}

function CancelChgPw(){
    let dialog = document.getElementById("Chng-modal");
        dialog.close();
}
function togglePasswordVisibility1() {
    const passwordInput = document.getElementById('current-pw');
    const eyeIcon = document.querySelector('.password-toggle-icon i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}
function togglePasswordVisibility2() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.password-toggle-icon i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}
function togglePasswordVisibility3() {
    const passwordInput = document.getElementById('cpassword');
    const eyeIcon = document.querySelector('.password-toggle-icon i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}
