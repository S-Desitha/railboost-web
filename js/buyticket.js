const url1 = "http://localhost:8080/railboost_backend_war_exploded/booking";
const url= "http://localhost:8080/railboost_backend_war_exploded/ticketPrice";

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
    var Start=document.getElementById("start-station");
    var End=document.getElementById("end-station");
    var value1 = Start.value;
    var value2 = End.value;
    var StationError=document.getElementById("station-error");
    if(value1==value2){
        StationError.innerHTML = "Both start and end stations can't be same.";
        return false;
    }
        StationError.innerHTML = "";
        return true;
}

function buyETicket() {
    booking = {};
  
    booking["startStation"] = document.getElementById("start-station").value;
    booking["endStation"] = document.getElementById("end-station").value;
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
  
    fetch(url1, params)
      .then(res => {
        if (res.ok) {
          window.location.reload();
        }
      });
  
    console.log(booking);
  }

  function getPrice(){
    var Start=document.getElementById("start-station").value;
    var End=document.getElementById("end-station").value;
    var Class=document.getElementById("class").value;
    var Count=document.getElementById("no-of-tickets").value;
    if (Start && End && Class && Count) {
      getTicketPrices(Class, Count);
    } else {
      console.log("Please fill in all required fields before getting the price.");
    }
  }


  function getTicketPrices(Class,Count) {
    var PriceOfOne=document.getElementById("price-of-one");
    let params = {
        startStation: document.getElementById("start-station").value,
        endStation: document.getElementById("end-station").value
    };

    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${url}?${queryString}`;
    fetch(urlQuery, {credentials: "include"})
        .then(res=> {
            if (res.ok){
                res.json().then(data => {
                    // document.getElementById("1st_class").value = data.firstclass;
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
                });
            }else {
              console.error(`Error fetching ticket prices. Status: ${res.status}`);
          }
        }).catch(error => {
          console.error('Error fetching ticket prices:', error);
      });

  }
