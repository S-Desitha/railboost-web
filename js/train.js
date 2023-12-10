function validateCompartments() {
    var compartmentsField = document.getElementById("compartments");
    var compartmentsError = document.getElementById("compartments-error");
    var compartmentsValue = parseInt(compartmentsField.value, 10); // Parse as an integer
  
    if (isNaN(compartmentsValue) || compartmentsValue < 0 || compartmentsValue > 100) {
      compartmentsError.innerHTML = "Please enter a valid number of compartments (0-100).";
      return false;
    }
  
    // Clear any previous error message
    compartmentsError.innerHTML = "";
  
    return true;
  }
  
  function updateTime(button, action) {
    // Get the current time
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();

    // Format the time as HH:mm
    var formattedTime = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

    // Get the corresponding row of the clicked button
    var row = button.closest('tr');

    // Update the relevant <td> based on the action
    if (action === 'arrivedTime') {
        row.querySelector('td:nth-child(4)').innerText = formattedTime;
    } else if (action === 'departuredTime') {
        row.querySelector('td:nth-child(5)').innerText = formattedTime;
    }
}

 