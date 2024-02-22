

const seasonEndpoint = "season";
const ticketPriceEndpoint = "ticketPrice";


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

function appplySeasonTicket() {
  season = {};

  season["startStation"] = document.getElementById("from").getAttribute("stationName");
  season["endStation"] = document.getElementById("to").getAttribute("stationName");
  season["passenger-type"] = document.getElementById("passenger-type").value;
  season["Start-date"] = new Date(document.getElementById("Start-date").value).toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"})
  season["duration"] = document.getElementById("duration").value;
  season["End-date"] = document.getElementById("End-date").value;
  season["trainClass"] = document.getElementById("class").value;
  season["totalPrice"] = document.getElementById("total-price").value;
  season["file"] = document.getElementById("img");
  console.log(season);

  const body = season;
  const params = {
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(body),
    method: "POST",
    credentials: "include"
  };

  customFetch(seasonEndpoint, params)
    .then(() => window.location())
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

  console.log(season);
//   alert("Check your email for E-Ticket.");
  // window.onbeforeunload = function{
  //   return true;
  // }
}

function getPrice(){
  var Start=document.getElementById("from").getAttribute("stationCode");
  var End=document.getElementById("to").getAttribute("stationCode");
  var Class=document.getElementById("class").value;
  var Duration=document.getElementById("duration").value;
  if (Start && End && Class && Duration) {
    getTicketPrices(Class, Duration);
  } else {
    console.log("Please fill in all required fields before getting the price.");
  }
}


async function getTicketPrices(Class,Duration) {
  var PriceOfOne=document.getElementById("price-of-one");
  var Start = document.getElementById("from").getAttribute("stationCode"); 
  var End = document.getElementById("to").getAttribute("stationCode"); 
  var Duration = document.getElementById("duration");
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
      document.getElementById("total-price").value = data.firstClass;
    }else if(Class == "2nd Class"){
      PriceOfOne.innerHTML = "Price of one ticket is "+data.secondClass+".";
      document.getElementById("total-price").value = data.secondClass;
    }else if(Class == "3rd Class"){
      PriceOfOne.innerHTML = "Price of one ticket is "+data.thirdClass+".";
      document.getElementById("total-price").value = data.thirdClass;
    }
  }
  catch (error) {
    console.log("Error fetching ticket price: " + error);
  }
}


function updateEndDate() {
    let startDate = new Date(document.getElementById('Start-date').value);
    let duration = document.getElementById('duration').value;

    if (startDate && duration) {
        let endDate = new Date(startDate);
        switch (duration) {
            case '1 Week':
                endDate.setDate(endDate.getDate() + 7);
                break;
            case '1 Month':
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case '3 Month':
                endDate.setMonth(endDate.getMonth() + 3);
                break;
            case '6 Month':
                endDate.setMonth(endDate.getMonth() + 6);
                break;
            default:
                break;
        }
        
        console.log(endDate);
        let endDateFormatted = (endDate.getMonth() + 1).toString().padStart(2, '0') + '/' + endDate.getDate().toString().padStart(2, '0') + '/' + endDate.getFullYear();
        document.getElementById("End-date").value = endDateFormatted;

        
        
    }
}