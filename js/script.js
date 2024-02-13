async function customFetch(endpoint, options, sendJWT) {
    let url = "http://localhost:8080/railboost_backend_war_exploded/";
    const frontendPort = window.location.port;

// Log the detected frontend port
console.log("Frontend Port:", frontendPort);
    
    if (endpoint!="login" && sendJWT!=false){
        options.headers = {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        };
    }

    url = url+endpoint;

    let resp = await fetch(url, options);
    if (resp.ok){
        try {
            return await resp.json();
        } catch(error) {
            console.log("Error in parsing response");
            console.log(error);
            return {status: resp.status};
        }
    }
    else{
        console.log("Invalid response");
        console.log(resp);
        if (resp.status==401) {
            let msg = await resp.text();
            if (msg=="expired") {
                window.alert("Session expired. Please login again.");
                window.location.href="/html/signin.html";
                return Promise.reject("login-redirected");
            }
        }
        else if (resp.status==400) {
            let data = await resp.json();
            let error_msg = data.detailMessage;
            if (error_msg=="signup-expired"){
                window.alert("You signup session has expired. Please contact administrator and signup again.");
            }
            window.location.href="/index.html";
            return Promise.reject(data.detailMessage);
        }
        return {
            isSuccessful: false,
            status: resp.status
        }
    }
}



function createNavBar(context) {
    fetch("/html/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementsByClassName("navbar")[0].innerHTML = data;
            if (context == "admin") {
                document.getElementById("sm-nav").remove();
                document.getElementById("passenger-nav").remove();

                document.getElementById("nav-about").remove();
                document.getElementById("nav-contact").remove();
                document.getElementById("nav-services").innerHTML = "Admin Services";
            }
            else if (context == "sm") {
                document.getElementById("admin-nav").remove();
                document.getElementById("passenger-nav").remove();

                document.getElementById("nav-about").remove();
                document.getElementById("nav-contact").remove();
                document.getElementById("nav-services").innerHTML = "SM Services";
            }
            else if (context == "passenger") {
                document.getElementById("admin-nav").remove();
                document.getElementById("sm-nav").remove();
            }
        });
}



function seatReserve() {
    var userResponse = confirm("Now you'll be redirected to the official website for seat reservations of Sri Lanka Railways.");
    if (userResponse) {
        window.location.href = "https://seatreservation.railway.gov.lk/"; 
    }
}


function confirmCall() {
    var userResponse = confirm("You can call this phone number only in the following cases.\nOccurring in a train and within a railway premises\n1. A conflict situation\n2. A theaf or related complaint\n3. Smoking, drug or alcohol use\n4. Harassment or other similar conduct\n5. Misuse of railway property");
    if (userResponse) {
        window.location.href = "tel:+94 112 336 614"; 
    }
}


function validateEmail() {
    var emailField = document.getElementById("email-field");

var emailError = document.getElementById("email-error");
    
    if(!emailField.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
        emailError.innerHTML = "Please enter a valid email address";
        return false;
    }
        emailError.innerHTML = "";
        return true;
    

}


function validatePhone(){
    var phoneField=document.getElementById("phone-field");
var phoneError=document.getElementById("phone-error");
    if(!phoneField.value.match(/^\d{10}$/)){
        phoneError.innerHTML = "<div>Please enter a valid phone number</div>";
        return false;
    }
        phoneError.innerHTML = "";
        return true;
}

function validatePassword() {
    var passwordField = document.getElementById("password");
    var confirmPasswordField = document.getElementById("cpassword");
    var passwordError = document.getElementById("password-error");
  
    if (passwordField.value !== confirmPasswordField.value) {
      passwordError.innerHTML = "Passwords do not match";
      return false;
    }
  
    passwordError.innerHTML = "";
    return true;
}

function validateStrPassword() {
    var passwordField = document.getElementById("password");
    var passwordError = document.getElementById("spassword-error");
  
    var passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  
    if (!passwordRegex.test(passwordField.value)) {
      passwordError.innerHTML = "<div>Password must be at least 8 characters long and include at least one </br> uppercase letter, one lowercase letter, one digit, and one special </br> character (!@#$%^&*).</div>";

      return false;
    }
  
    passwordError.innerHTML = "";
    return true;
}
function toggleDropdown() {
    var dropdown = document.getElementById("drop");
    if (dropdown.style.display === "none") {
      dropdown.style.display = "block";
    } else {
      dropdown.style.display = "none";
    }
    
  }
  
  window.onclick = function(event){
    if (!event.target.matches('.dropbtn')){
        var dropdown = document.getElementById("drop");
        dropdown.style.display = "none";
    }
  }
  