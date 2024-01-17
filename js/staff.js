// const url = "http://localhost:8080/railboost_backend_war_exploded/staff";
const endpoint = "staff";

console.log("Hello from staff.js");
document.addEventListener("DOMContentLoaded", async function() {
    document.getElementById("staff_form").reset();

    try {

        let data = await customFetch(endpoint, {});
    
        data.forEach(staffMember => {
            let editButton = document.createElement("button");
            editButton.classList.add("edit-button");
            editButton.innerHTML = "<i class='fas fa-edit'></i>";
            editButton.setAttribute("staffMember", JSON.stringify(staffMember));
            editButton.onclick = editStaff;
    
            let deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = "<i class='fas fa-trash-alt'></i>";
    
            let row = document.getElementById("staff_table").insertRow(-1);
            row.insertCell(0).innerHTML = staffMember.staffId;
            row.insertCell(1).innerHTML = staffMember.user.fName + " " + staffMember.user.lName;
            row.insertCell(2).innerHTML = staffMember.user.username;
            row.insertCell(3).innerHTML = staffMember.user.email;
            row.insertCell(4).innerHTML = staffMember.user.telNo;
            row.insertCell(5).innerHTML = staffMember.user.role;
            row.insertCell(6).innerHTML = staffMember.station;
            row.insertCell(7).append(editButton, deleteButton);
    
        });
    } catch(error) {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }
});



function editStaff() {
    let member = JSON.parse(this.getAttribute("staffMember"));

    console.log(member);

    const button = document.getElementById("add-staff-button");

    document.getElementById("add-staff-heading").innerHTML = "Update Staff Details";
    button.innerHTML = "Update";

    document.getElementById('staffId').value = member["staffId"];
    document.getElementById('staffId').disabled = true;
    document.getElementById('fName').value = member.user["fName"];
    document.getElementById('lName').value = member.user["lName"];
    document.getElementById('role').value = member.user["role"]=="sm"? "SM" : "TCO";
    document.getElementById('railwayStation').value = member["station"];
    document.getElementById('email-field').value = member.user["email"];
    document.getElementById('phone-field').value = member.user["telNo"]
    document.getElementById('username').value = member.user["username"];
    document.getElementById('fName').disabled = true;
    document.getElementById('lName').disabled = true;
    document.getElementById('email-field').disabled = true;
    document.getElementById('phone-field').disabled = true;
    document.getElementById('username').disabled = true;

    button.setAttribute("member", JSON.stringify(member));
    button.onclick = updateStaff;
}



function updateStaff() {
    staffMember = {user: {}};

    staffMember["staffId"] = document.getElementById('staffId').value;
    staffMember["station"] = document.getElementById('railwayStation').value;
    // staffMember.user["fName"] = document.getElementById("fName").value;
    // staffMember.user["lName"] = document.getElementById("lName").value;
    // staffMember.user["role"] = document.getElementById("role").value;
    // staffMember.user["email"] = document.getElementById('email-field').value;
    // staffMember.user["telNo"] = document.getElementById('phone-field').value;
    // staffMember.user["username"] = document.getElementById('username').value;


    const body = staffMember;
    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(body),
        method : "PUT"
    };


    customFetch(endpoint, params)
        .then(() => window.location.reload())
        .catch ((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });


    console.log(staffMember);
}





function updateUsername() {
    
    const staffId = document.getElementById('staffId').value;
    const firstname = document.getElementById('fName').value;
    const lastname = document.getElementById('lName').value;
    const role = document.getElementById('role').value;
    // const railwayStation = document.getElementById('railwayStation').value;

    
    const lastInitial = lastname.charAt(0).toUpperCase();

    const usernamePrefix = role; // Use the selected role as the username prefix

    const username = usernamePrefix + staffId + firstname + lastInitial ;
    document.getElementById('username').value = username;
    
}
updateUsername();


function addStaff() {
    staffMember = {};

    const email = document.getElementById('email').value;
    const telephone = document.getElementById('telephone').value;
    const username = document.getElementById('username').value;

    staffMember["staffId"] = document.getElementById('staffId').value;
    staffMember["station"] = document.getElementById('railwayStation').value;
    staffMember["fName"] = document.getElementById("fName").value;
    staffMember["lName"] = document.getElementById("lName").value;
    staffMember["role"] = document.getElementById("role").value;
    staffMember["email"] = email;
    staffMember["telNo"] = telephone;

    console.log(staffMember);


    const body = staffMember;
    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(body),
        method : "POST"
    };

    customFetch(endpoint, params)
        .then(()=> window.location.reload())
        .catch((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });

    console.log(train);


    alert(`Link to create a password for the Username :${username} has been sent to the email: ${email} and phone number: ${telephone}.`);
    // Clear the form

    document.getElementById('staffId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('role').value = ''; 
    document.getElementById('railwayStation').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telephone').value = '';
    document.getElementById('username').value = '';

    // Hide the message
    document.getElementById('message').style.display = 'none';
}
