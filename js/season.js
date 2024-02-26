

const seasonEndpoint = "season";
const ticketPriceEndpoint = "ticketPrice";
let ENDDATE;

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

  season["startStation"] = document.getElementById("from").getAttribute("stationCode");
  season["endStation"] = document.getElementById("to").getAttribute("stationCode");
  season["passengerType"] = document.getElementById("passenger-type").value;
  season["startDate"] = new Date(document.getElementById("Start-date").value).toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"})
  season["duration"] = document.getElementById("duration").value;
  season["endDate"] = ENDDATE;
  season["trainClass"] = document.getElementById("class").value;
  season["totalPrice"] = document.getElementById("total-price").value;
  // season["file"] = document.getElementById("img");
  console.log(season);
  const fileInput = document.getElementById("img");
  const file = fileInput.files[0];

  let formData = new FormData(); 


  const body = JSON.stringify(season);
  formData.append("jsonObj",body);
  formData.append("file",file);
  if (season["startStation"] && season["endStation"] && season["passengerType"] && season["startDate"] && season["duration"] && season["endDate"] && season["trainClass"] && season["totalPrice"] && file) {
    const params = {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: formData,
      method: "POST",
      credentials: "include"
    };

    customFetch(seasonEndpoint, params)
      .then(() => window.location())
      .catch ((error) => {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
      });

    console.log(season);
    alert("Season application is recieved.");
    location.reload();

  }

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
  let price;
  var PriceOfOne=document.getElementById("price-of-one");
  var Start = document.getElementById("from").getAttribute("stationCode"); 
  var End = document.getElementById("to").getAttribute("stationCode"); 
  var type = document.getElementById("passenger-type").value;
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
      // document.getElementById("total-price").value = data.firstClass;
      price = data.firstClass*60;
    }else if(Class == "2nd Class"){
      PriceOfOne.innerHTML = "Price of one ticket is "+data.secondClass+".";
      // document.getElementById("total-price").value = data.secondClass;
      price = data.secondClass*60;
    }else if(Class == "3rd Class"){
      PriceOfOne.innerHTML = "Price of one ticket is "+data.thirdClass+".";
      // document.getElementById("total-price").value = data.thirdClass;
      price = data.thirdClass*60;
    }

    if (Duration == "1 Week"){
      price = ((price/100)*120)/4;
    }else if(Duration == "1 Month"){
      price = price;
    }else if(Duration == "3 Month"){
      price = price*3;
    }
    // else if(Duration == "6 Month"){
    //   price = price*6;
    // }

    if (type == "Normal Passenger"){
      price = Math.ceil(((price/100)*40)/100)*100;
    }else if(type == "Government Servant"){
      price = Math.ceil(((price/100)*15)/100)*100;
    }else if(type == "Student 1"){
      price = Math.ceil(((price/100)*5)/50)*50;
    }else if(type == "Student 2"){
      price = Math.ceil(((price/100)*10)/50)*50;
    }else if(type == "Railway Servant"){
      price = Math.ceil(((price/100)*3)/100)*100;
    }
    document.getElementById("total-price").value = price;
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
        ENDDATE = endDate.getFullYear() + '-' + ('0' + (endDate.getMonth() + 1)).slice(-2) + '-' + ('0' + endDate.getDate()).slice(-2);

        
        
    }
}