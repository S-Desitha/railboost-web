// // Wait for the DOM to be ready
var totalTicketRevenue;
var totalParcelRevenue;
var trainCount;
var NoTicket;

document.addEventListener('DOMContentLoaded', async function () {

   
    getDashDetails();
    try{
       const endpoint7 = "getRevenue";
        let data = await customFetch(endpoint7, {});
        console.log(data);
         totalTicketRevenue = data.totalTicketRevenue;
        totalParcelRevenue = data.totalParcelBookingRevenue
        let parcelRevenueList = [];
        parcelRevenueList = data.monthlyParcelRevenueList;
        let ticketrevenueList = data.monthlyTicketRevenueList;
        console.log(parcelRevenueList);
        console.log(ticketrevenueList);
        console.log(totalTicketRevenue);
        console.log(totalParcelRevenue);
        // let countElement = document.getElementById('ticket-revenue');
        // console.log(countElement);
        getElementById('ticket-revenue').setAttribute('data-target', totalTicketRevenue);

        // document.getElementById("ticket-revenue").dataset.target= "#totalTicketRevenue"

    }catch{
        
    }
    

 
 


// Get all elements with the class 'count'
const counter1 = document.getElementById('parcel-revenue');
const counter3 = document.getElementById('trainCount');
const counter4 = document.getElementById('ticket-count');
const counter2 = document.getElementById('ticket-revenue');

console.log(totalParcelRevenue);
console.log(totalTicketRevenue);
console.log(trainCount);
console.log(NoTicket);
startCounter(counter1,totalParcelRevenue);
startCounter(counter2,totalTicketRevenue);
startCounter(counter3,trainCount);
startCounter(counter4,NoTicket);


// Function to start the counter animation
function startCounter(counter,target) {
   // const target = totalTicketRevenue;
   const increment = target / 50; // Increment value for smooth animation

   // Initial value
   let currentValue = 0;

   // Function to update the counter value
   function updateCounter() {
       currentValue += increment;

       // Check if the counter is for revenue
       if (counter.classList.contains('revenue')) {
           // Format the current value with "$" sign and commas
           counter.textContent = 'Rs ' + formatNumber(Math.floor(currentValue));
       } else {
           // For other counters, just display the value
           counter.textContent = Math.floor(currentValue);
       }

       // Stop the animation when the target is reached
       if (currentValue < target) {
           requestAnimationFrame(updateCounter);
       } else {
           // Ensure the final value is exact
           if (counter.classList.contains('revenue')) {
               counter.textContent = 'Rs ' + formatNumber(target);
           } else {
               counter.textContent = target;
           }
       }
   }

   // Start the counter animation
   updateCounter();
}

// Format a number with commas
function formatNumber(number) {
   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Start the counter animation for each element with the class 'count'
// counters.forEach(startCounter);

   
});

async function getDashDetails(){
const endpointDash="dashboard";

   let data = await customFetch(endpointDash, {credentials: "include"});
   console.log(data);
   trainCount=data.trainCount;
   NoTicket=data.noTicket;
   console.log(trainCount);
   console.log(NoTicket);
   // getElementById('trainCount').setAttribute('data-target', trainCount);
   // getElementById('ticket-count').setAttribute('data-target', NoTicket);
}

