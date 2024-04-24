
async function generateHash() {
    console.log("Generating hash...");
    // const currency = document.getElementById("currency").value;
    // const orderId = localStorage.getItem("orderID").valueOf();
    // const amount = localStorage.getItem("amount").valueOf();
    document.getElementById("order_id").value=localStorage.getItem("orderID").valueOf();
    document.getElementById("amount").value=localStorage.getItem("amount").valueOf();
    document.getElementById("currency").value="LKR";
    // split the name in the localstorage into two parts and store them in the respective fields
    const name = localStorage.getItem("name").valueOf().split(" ");
    console.log(name);
    document.getElementById("first_name").value=name[0];
    document.getElementById("last_name").value=name[1];
    document.getElementById("Sstation").value=localStorage.getItem("Sstation").valueOf();
    document.getElementById("Estation").value=localStorage.getItem("Estation").valueOf();
    document.getElementById("date").value=localStorage.getItem("date").valueOf();
    document.getElementById("class").value=localStorage.getItem("class").valueOf();
    document.getElementById("number-of-tickets").value=localStorage.getItem("no-of-tickets").valueOf();
    

    const orderId = document.getElementById("order_id").value;
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;

   
    console.log(amount);
    console.log(currency);

    const endpoint = `/generateHash?order_id=${orderId}&amount=${amount}&currency=${currency}`; 

    try {
       // Construct params object for customFetch
       const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Adjust content type if necessary
        }
    };

    // Send POST request with customFetch
    const hashedValue = await customFetch(endpoint, params);
    
    console.log("Generated Hash:", hashedValue.hash);
    // set the value to this hash of the element with ID hash
    document.getElementById("hash").value = hashedValue.hash;
    
} catch (error) {
    console.error("Error generating hash:", error);
    throw error; // Propagate the error to the caller
}
}
document.addEventListener("DOMContentLoaded", generateHash);

