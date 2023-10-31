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
  