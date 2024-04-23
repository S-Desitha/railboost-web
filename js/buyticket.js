// const url1 = "http://localhost:8080/railboost_backend_war_exploded/booking";
// const url= "http://localhost:8080/railboost_backend_war_exploded/ticketPrice";


const bookingEndpoint = "booking";
const ticketPriceEndpoint = "ticketPrice";

const urlParams = new URLSearchParams(window.location.search);
const paymentSuccess = urlParams.get('payment_success');
console.log(paymentSuccess);
// type of paymentSuccess
console.log(typeof paymentSuccess);

// If the 'payment_success' parameter is present, call buyETicket function
if (paymentSuccess=="successful") {
  console.log("Payment successful!");
  buyETicket();
}

if (paymentSuccess=="unsuccessful") {
  console.log("Payment unsuccessful!");
  showPaymentError();
}

function showPaymentError() {
  Swal.fire({
    icon: 'error',
    title: 'Payment Unsuccessful',
    text: 'Payment processing was unsuccessful. Please try again.',
    confirmButtonText: 'OK'
  }).then(() => {
    // Reload the page after the user clicks OK
    // redirect to buytickets.html page


    window.location.href = 'http://localhost:5500/html/passenger/buyticket.html';
  });
  
}
function validateNoOfTicket(){
    var Field=document.getElementById("no-of-tickets");
    var Error=document.getElementById("error");
    var value = Field.value;
    if(!value.match(/^\d+$/) || value<= 0){
        Error.innerHTML = "Please enter a valid no. of tickets.";
        return false;
    }
    if( value >= 21){
        Error.innerHTML = "Please enter a value equal or lower than 20.";
        return false;
    }
        Error.innerHTML = "";
        return true;
}

function validateStation(){
  
    let Start=document.getElementById("from").getAttribute("stationCode");
    let End=document.getElementById("to").getAttribute("stationCode");
    let StationError=document.getElementById("station-error");
    if(Start==End){
        StationError.innerHTML = "Both start and end stations can't be same.";
        return false;
    }
        StationError.innerHTML = "";
        return true;
}

function buyETicket() {
  const booking = {};

  booking["startStation"] = localStorage.getItem("Sstationcode");
  booking["endStation"] = localStorage.getItem("Estationcode");
  booking["date"] = booking["date"] = new Date(localStorage.getItem("date")).toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"});
  booking["trainClass"] = localStorage.getItem("class");
  booking["numberOfTickets"] = localStorage.getItem("no-of-tickets");
  booking["totalPrice"] = localStorage.getItem("amount");
  console.log(booking["date"]);
  // type of date
  console.log(typeof booking["date"]);

  console.log("Booking details:", booking);

  const body = booking;
  const params = {
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(body),
    method: "POST",
    credentials: "include"
  };

  customFetch(bookingEndpoint, params)
    .then(() => {
      // Show SweetAlert notification for successful payment
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        text: 'Check your email for the E-Ticket.',
        confirmButtonText: 'OK'
      }).then(() => {
        // Reload the page after the user clicks OK
        // redirect to buytickets.html page


        window.location.href = 'http://localhost:5500/html/passenger/buyticket.html';
      });
    })
    .catch ((error) => {
      if (error == "login-redirected")
        localStorage.setItem("last_url", window.location.pathname);
    });
}


function getPrice(){
  var Start=document.getElementById("from").getAttribute("stationCode");
  var End=document.getElementById("to").getAttribute("stationCode");
  console.log(Start);
  console.log(End);
  var Class=document.getElementById("class").value;
  var Count=document.getElementById("no-of-tickets").value;
  if (Start && End && Class && Count) {
    getTicketPrices(Class, Count);
  } else {
    console.log("Please fill in all required fields before getting the price.");
  }
}


async function getTicketPrices(Class,Count) {
  // var PriceOfOne=document.getElementById("price-of-one");
  var Start = document.getElementById("from").getAttribute("stationCode"); 
  var End = document.getElementById("to").getAttribute("stationCode"); 
  console.log(Start);
  let params = {
      startStation: Start,
      endStation: End
  };

  let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
  let urlQuery = `${ticketPriceEndpoint}?${queryString}`;

  try {
    let data = await customFetch(urlQuery, {credentials: "include"});
    console.log(urlQuery);
    if (Class == "1st Class"){
      // PriceOfOne.innerHTML = "Price of one ticket is "+data.firstClass+".";
      document.getElementById("amount").value = data.firstClass*Count;
    }else if(Class == "2nd Class"){
      // PriceOfOne.innerHTML = "Price of one ticket is "+data.secondClass+".";
      document.getElementById("amount").value = data.secondClass*Count;
    }else if(Class == "3rd Class"){
      // PriceOfOne.innerHTML = "Price of one ticket is "+data.thirdClass+".";
      document.getElementById("amount").value = data.thirdClass*Count;
    }
  }
  catch (error) {
    console.log("Error fetching ticket price: " + error);
  }
}

async function getPriceList(){
  var PriceOfFirst=document.getElementById("price-of-first");
  var PriceOfSecond=document.getElementById("price-of-second");
  var PriceOfThird=document.getElementById("price-of-third");
  var Start=document.getElementById("from").getAttribute("stationCode");
  var End=document.getElementById("to").getAttribute("stationCode");
  if (Start && End) {
    let params = {
      startStation: Start,
      endStation: End
    };

    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${ticketPriceEndpoint}?${queryString}`;
    try{
      let data = await customFetch(urlQuery, {credentials: "include"});
      if (Start != End) {
        document.querySelector(".price-list").style.display = "block";
        PriceOfFirst.innerHTML =  "First Class: <span> " +data.firstClass+".00 </span>";
        PriceOfSecond.innerHTML = "Second Class: <span>"+data.secondClass+".00 </span>";
        PriceOfThird.innerHTML =  "Third Class: <span>"+data.thirdClass+".00 </span>";
      }else{
        document.querySelector(".price-list").style.display = "none";
      }
    }catch (error) {
      console.log("Error fetching price list: " + error);
    }
  } else {
    console.log("Fill in start and end starion fields before getting the price list.");
  }
}
