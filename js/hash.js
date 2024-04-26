async function generateHash() {
    console.log("Generating hash...");

    // Check paymentType
    const urlParams = new URLSearchParams(window.location.search);
    const context = urlParams.get('context');

    if (context === "season") {
        // Update fields with season details
        document.getElementById("order_id").value = localStorage.getItem("orderID");
        document.getElementById("amount").value = localStorage.getItem("season_totalPrice");
        document.getElementById("currency").value = "LKR";

        const name = localStorage.getItem("name").split(" ");
        document.getElementById("first_name").value = name[0];
        document.getElementById("last_name").value = name[1];
        document.getElementById("Sstation").value = localStorage.getItem("season_startStation");
        document.getElementById("Estation").value = localStorage.getItem("season_endStation");
        document.getElementById("class").value = localStorage.getItem("season_trainClass");


        // remove date field from the form
        const dateField = document.getElementById("date");
        const dateLabel = document.getElementById("dateL");
        dateField.parentElement.removeChild(dateField);
        dateLabel.parentElement.removeChild(dateLabel);

        // Remove the number of tickets field
        const ticketsField = document.getElementById("number-of-tickets");
        const ticketsLabel = document.getElementById("numt");
        ticketsField.parentElement.removeChild(ticketsField);
        ticketsLabel.parentElement.removeChild(ticketsLabel);

        // Add season start date field
        const seasonStartDate = localStorage.getItem("season_startDate");
        const seasonStartDateInput = document.createElement("input");
        seasonStartDateInput.type = "text";
        seasonStartDateInput.id = "season-start-date";
        seasonStartDateInput.name = "seasonStartDate";
        seasonStartDateInput.value = seasonStartDate;
        seasonStartDateInput.readOnly = true;
        // label for start date
        const seasonStartDateLabel = document.createElement("label");
        seasonStartDateLabel.htmlFor = "season-start-date";
        seasonStartDateLabel.textContent = "Season Start Date:";

        // create div
        const formGroup1 = document.createElement("div");
        formGroup1.classList.add("form-group");
        formGroup1.appendChild(seasonStartDateLabel);
        formGroup1.appendChild(seasonStartDateInput);

        // append the div to the journey details
        document.querySelector(".journey-details").appendChild(formGroup1);

        

        // Add season end date field
        const seasonEndDate = localStorage.getItem("season_endDate");
        const seasonEndDateInput = document.createElement("input");
        seasonEndDateInput.type = "text";
        seasonEndDateInput.id = "season-end-date";
        seasonEndDateInput.name = "seasonEndDate";
        seasonEndDateInput.value = seasonEndDate;
        seasonEndDateInput.readOnly = true;

        const seasonEndDateLabel = document.createElement("label");
        seasonEndDateLabel.htmlFor = "season-end-date";
        seasonEndDateLabel.textContent = "Season End Date:";

        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        formGroup.appendChild(seasonEndDateLabel);
        formGroup.appendChild(seasonEndDateInput);

        document.querySelector(".journey-details").appendChild(formGroup);

        document.querySelector('input[name="return_url"]').value = "http://localhost:5500/html/passenger/seasonticket.html?payment_success=successful";
        document.querySelector('input[name="cancel_url"]').value = "http://localhost:5500/html/passenger/seasonticket.html?payment_success=unsuccessful";
   
    } else {
        // For other payment types (e.g., e-ticket), update fields as before
        document.getElementById("order_id").value = localStorage.getItem("orderID");
        document.getElementById("amount").value = localStorage.getItem("amount");
        document.getElementById("currency").value = "LKR";

        const name = localStorage.getItem("name").split(" ");
        document.getElementById("first_name").value = name[0];
        document.getElementById("last_name").value = name[1];
        document.getElementById("Sstation").value = localStorage.getItem("Sstation");
        document.getElementById("Estation").value = localStorage.getItem("Estation");
        document.getElementById("date").value = localStorage.getItem("date");
        document.getElementById("class").value = localStorage.getItem("class");
        document.getElementById("number-of-tickets").value = localStorage.getItem("no-of-tickets");
    }

    const orderId = document.getElementById("order_id").value;
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;

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
