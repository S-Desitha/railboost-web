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
        phoneError.innerHTML = "Please enter a valid phone number";
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
      passwordError.innerHTML = "Password must be at least 8 characters long and include at least one uppercase \nletter, one lowercase letter, one digit, and one special character (!@#$%^&*).";

      return false;
    }
  
    passwordError.innerHTML = "";
    return true;
}
  
  
document.addEventListener("DOMContentLoaded", function(){
    let username = localStorage.getItem("username");
    if (username!=null) {
        let letter = username[0];
        
    }
});