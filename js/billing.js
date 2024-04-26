
function generateOrderID() {
    console.log("Generating order ID...");
    // Get current timestamp
    const timestamp = Date.now().toString(); // Convert timestamp to string
  
    // Select two random characters from the timestamp and convert to uppercase
    const timestampChars = timestamp.substring(Math.floor(Math.random() * (timestamp.length - 1)), 4).toUpperCase();

    // Generate a random number/string (you can customize this part as needed)
    const randomString = Math.random().toString(36).substring(2, 4).toUpperCase(); // Generates a random 2-character string and convert to uppercase

    // Select two random characters from the random string
    const randomStringChars = randomString.substring(Math.floor(Math.random() * (randomString.length - 1)), 2);

    // Generate a random number between 0 and 999 and convert to uppercase
    const randomComponent = Math.floor(Math.random() * 1000).toString().toUpperCase();
  
    // Select two random characters from the random component
    const randomComponentChars = randomComponent.substring(Math.floor(Math.random() * (randomComponent.length - 1)), 2);
  
    // Concatenate "RB", selected characters from timestamp, random string, and random component
    let orderID = `RB${timestampChars}${randomStringChars}${randomComponentChars}`;

    // Trim orderID to 8 characters if necessary
    if (orderID.length > 8) {
        orderID = orderID.substring(0, 8);
    }

    localStorage.setItem("orderID", orderID);
    console.log("Generated order ID:", orderID);
}


function prepareBilling(){
    // add sationname attribute from the id with "from" and store it in localstorage
    localStorage.setItem("Sstation", document.getElementById("from").getAttribute("stationname"));
    // add stationcode attribute from the id with "from" and store it in localstorage
    localStorage.setItem("Sstationcode", document.getElementById("from").getAttribute("stationcode"));
    // add stationcode attribute from the id with "to" and store it in localstorage
    localStorage.setItem("Estation", document.getElementById("to").getAttribute("stationname"));
    // add stationcode attribute from the id with "to" and store it in localstorage
    localStorage.setItem("Estationcode", document.getElementById("to").getAttribute("stationcode"));
    // add value from the id with "date" and store it in localstorage
    localStorage.setItem("date", document.getElementById("date").value);
    // add value from the id with "class" and store it in localstorage
    localStorage.setItem("class", document.getElementById("class").value);
    // add value from the id with "no-of-tickets" and store it in localstorage
    localStorage.setItem("no-of-tickets", document.getElementById("no-of-tickets").value);
    // add value from the id with "amount" and store it in localstorage
    localStorage.setItem("amount", document.getElementById("amount").value);

    // proceed to payment.html page
    window.location.href = "payment.html";


    
}

function prepareBillingSeason(season){
    console.log("prepareBillingSeason")
    localStorage.setItem("season_id", season.id);
    localStorage.setItem("season_startStation", season.startStation);
    localStorage.setItem("season_endStation", season.endStation);
    localStorage.setItem("season_startDate", season.startDate);
    localStorage.setItem("season_endDate", season.endDate);
    localStorage.setItem("season_trainClass", season.trainClass);
    localStorage.setItem("season_totalPrice", season.totalPrice);
    localStorage.setItem("paymentType", "season");
    
    window.location.href = "payment.html";
}

  
  

  

