function generateHash() {
    // Gather relevant form data
    var orderId = document.getElementsByName("order_id")[0].value;
    var amount = document.getElementsByName("amount")[0].value;
    var currency = document.getElementsByName("currency")[0].value;

    // Create a JSON object with the relevant data
    var data = {
        "order_id": orderId,
        "amount": amount,
        "currency": currency
    };

    // Convert the JSON object to a string
    var jsonData = JSON.stringify(data);

    // Send AJAX request to backend
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/generateHash"); // Replace "/generateHash" with your backend endpoint
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Request successful, populate hash value
                document.getElementById("hash").value = xhr.responseText;
                // Submit the form
                document.getElementById("paymentForm").submit();
            } else {
                // Handle error
                console.error("Error: Unable to generate hash");
            }
        }
    };
    xhr.send(jsonData);
}
document.addEventListener("DOMContentLoaded", generateHash);