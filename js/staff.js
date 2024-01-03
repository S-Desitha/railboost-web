const url = "http://localhost:8080/railboost_backend_war_exploded/staff";

function updateUsername() {
    const staffId = document.getElementById('staffId').value;
    const firstname = document.getElementById('fName').value;
    const lastname = document.getElementById('lName').value;
    const role = document.getElementById('role').value;
    const railwayStation = document.getElementById('railwayStation').value;

   
    const lastInitial = lastname.charAt(0).toUpperCase();

    const usernamePrefix = role; // Use the selected role as the username prefix

    const username = usernamePrefix + staffId + firstname + lastInitial + railwayStation;
    document.getElementById('username').value = username;
}

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
        method : "POST",
        credentials : "include"
    };

    fetch(url, params)
    .then(res => {
        if(res.ok) {
            window.location.reload();
        }
    });

    console.log(train);


    alert(`Link to create a password for the Username :${username} has been sent to the email: ${email} and phone number: ${telephone}.`);
    // Clear the form
}
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
