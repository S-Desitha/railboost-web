function updateUsername() {
    const staffId = document.getElementById('staffId').value;
    const firstname = document.getElementById('fname').value;
    const lastname = document.getElementById('lname').value;
    const role = document.getElementById('role').value;
    const railwayStation = document.getElementById('railwayStation').value;

   
    const lastInitial = lastname.charAt(0).toUpperCase();

    const usernamePrefix = role; // Use the selected role as the username prefix

    const username = usernamePrefix + staffId + firstname + lastInitial + railwayStation;
    document.getElementById('username').value = username;
}

function addStaff() {
    const email = document.getElementById('email').value;
    const telephone = document.getElementById('telephone').value;
    const username = document.getElementById('username').value;


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

