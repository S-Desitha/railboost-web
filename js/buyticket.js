// const url1 = "http://localhost:8080/railboost_backend_war_exploded/booking";
// const url= "http://localhost:8080/railboost_backend_war_exploded/ticketPrice";

const bookingEndpoint = "booking";
const ticketPriceEndpoint = "ticketPrice";

function validateNoOfTicket(){
    var Field=document.getElementById("no-of-tickets");
    var Error=document.getElementById("error");
    var value = Field.value;
    if(!value.match(/^\d+$/) || value<= 0){
        Error.innerHTML = "Please enter a valid no. of tickets.";
        return false;
    }
    if( value >= 21){
        Error.innerHTML = "Please enter a value lower than 21.";
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
  booking = {};

  booking["startStation"] = document.getElementById("from").getAttribute("stationName");
  booking["endStation"] = document.getElementById("to").getAttribute("stationName");
  booking["date"] = new Date(document.getElementById("date").value).toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"})
  booking["trainClass"] = document.getElementById("class").value;
  booking["numberOfTickets"] = document.getElementById("no-of-tickets").value;
  booking["totalPrice"] = document.getElementById("total-price").value;

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
    .then(() => window.location.reload())
    .catch ((error) => {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
    });

  // fetch(url1, params)
  //   .then(res => {
  //     if (res.ok) {
  //       window.location.reload();
  //     }
  //   });

  console.log(booking);
  alert("Check your email for E-Ticket.");
  // window.onbeforeunload = function{
  //   return true;
  // }
}

function getPrice(){
  var Start=document.getElementById("from").getAttribute("stationCode");
  var End=document.getElementById("to").getAttribute("stationCode");
  var Class=document.getElementById("class").value;
  var Count=document.getElementById("no-of-tickets").value;
  if (Start && End && Class && Count) {
    getTicketPrices(Class, Count);
  } else {
    console.log("Please fill in all required fields before getting the price.");
  }
}


async function getTicketPrices(Class,Count) {
  var PriceOfOne=document.getElementById("price-of-one");
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
      PriceOfOne.innerHTML = "Price of one ticket is "+data.firstClass+".";
      document.getElementById("total-price").value = data.firstClass*Count;
    }else if(Class == "2nd Class"){
      PriceOfOne.innerHTML = "Price of one ticket is "+data.secondClass+".";
      document.getElementById("total-price").value = data.secondClass*Count;
    }else if(Class == "3rd Class"){
      PriceOfOne.innerHTML = "Price of one ticket is "+data.thirdClass+".";
      document.getElementById("total-price").value = data.thirdClass*Count;
    }
  }
  catch (error) {
    console.log("Error fetching ticket price: " + error);
  }
}
