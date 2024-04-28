// const url = "http://localhost:8080/railboost_backend_war_exploded/journey";
const endpoint = "journey";


async function createJourneys() {
    let param = {
        date: new Date().toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"})
    }
    // Get the journeys from the backend
    let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(param))}`;

    try {
        let data = await customFetch(urlQuery, {});
        
        console.log(data);
        // Create a table row for each journey
        if (Object.keys(data)){
            data.forEach(journey => {
                let row = document.getElementById("schedule_table").insertRow(-1);
                row.insertCell(0).innerHTML = journey.scheduleId;
                row.insertCell(1).innerHTML = journey.schedule.trainId;
                row.insertCell(2).innerHTML = journey.schedule.startStationName;
                row.insertCell(3).innerHTML = journey.schedule.endStationName;
                row.insertCell(4).innerHTML = journey.schedule.speed;
                row.insertCell(5).innerHTML = `<a href="/html/sm/sm-update.html?scheduleId=${journey.scheduleId}"><button class="view-button">
                Update <i class="fa-solid fa-pen-to-square"></i></button>
                </a>`;
            });
        }           
    } catch(error) {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }
}



async function createJourney() {
    let param = {
        date: new Date().toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"}),
        scheduleId: new URLSearchParams(window.location.search).get("scheduleId")
        // scheduleId: 8710
    }

    let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(param))}`;
    
    try {
        let data = await customFetch(urlQuery, {})
        console.log(data)
        
        // Create a table row for each journey
        if (Object.keys(data)){
            data.stations.forEach(js => {
                
                let arrivalButton = document.createElement("button");
                arrivalButton.classList.add("view-button");
                arrivalButton.innerHTML = "Arrived <i class='fa-solid fa-arrow-down'></i>";
                arrivalButton.onclick = function() {updateTime(js.scheduleId, js.station, "arrival");}
                
                let departureButton = document.createElement("button");
                departureButton.classList.add("view-button");
                departureButton.innerHTML = "Departured <i class='fa-solid fa-arrow-up'></i>";
                departureButton.onclick = function() {updateTime(js.scheduleId, js.station, "departure");}
                
                let row = document.getElementById("journey_table").insertRow(-1);
                row.setAttribute("id", js.station);
                
                row.insertCell(0).innerHTML = js.stationName;
                row.insertCell(1).innerHTML = new Date('', '', '', js.scheduledArrivalTime.split(":")[0], js.scheduledArrivalTime.split(":")[1], js.scheduledArrivalTime.split(":")[2]).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
                row.insertCell(2).innerHTML = new Date('', '', '', js.scheduledDepartureTime.split(":")[0], js.scheduledDepartureTime.split(":")[1], js.scheduledDepartureTime.split(":")[2]).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
                if (js.arrivalTime==null)
                    row.insertCell(3).appendChild(arrivalButton);
                else
                    row.insertCell(3).innerHTML = new Date('', '', '', js.arrivalTime.split(":")[0], js.arrivalTime.split(":")[1], js.arrivalTime.split(":")[2]).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
                if (js.departureTime==null)
                    row.insertCell(4).appendChild(departureButton);
                else
                    row.insertCell(4).innerHTML = new Date('', '', '', js.departureTime.split(":")[0], js.departureTime.split(":")[1], js.departureTime.split(":")[2]).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});

            });
        }
    } catch(error) {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }       
}



async function updateTime(scheduleId, station, timeType) {
    let body = {
        scheduleId: scheduleId,
        station: station
    }

    let time = new Date().toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
    if(timeType == "arrival")
        body.arrivalTime = time;
    else
        body.departureTime = time;

    const params = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        method: "PUT"
    };

    console.log(params);

    try {
        let data = await customFetch(endpoint, params);
        console.log(data.status);
        if (data.status == 200) {
            if (timeType == "arrival")
                document.getElementById(station).cells[3].innerHTML = time;
            else if (timeType == "departure")
                document.getElementById(station).cells[4].innerHTML = time;
        } else if (data.status == 403) {
            // Using SweetAlert for displaying error message
            Swal.fire({
                icon: 'error',
                title: 'Permission Denied',
                text: `You don't have permission to update station: ${station}`,
            });
        }
    } catch(error) {
        if (error == "login-redirected") {
            localStorage.setItem("last_url", window.location.pathname);
        }
    }
}


document.addEventListener("DOMContentLoaded", async function () {
    const endpoint3 = "parcelReceiving"
    let params = {
        view: "1",
    };
    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${endpoint3}?${queryString}`;
    
    const parcelList = document.querySelector(".parcel-list");
    parcelList.innerHTML = "";
    let count = 0;
  
    try {
      let data = await customFetch(urlQuery, {credentials: "include"});
      
      data.forEach(parcelReceiving => {
        if (data.length === 0) {
            document.querySelector(".empty_msg").style.display = "block";
            return;
        }else{
            if (count!=6){
            count=count+1;
            document.querySelector(".empty_msg").style.display = "none";
            const listItem = document.createElement("li");
            const trainNoDiv = document.createElement("div");
            trainNoDiv.classList.add("parcel-train");
            trainNoDiv.innerHTML = `<h4>Schedule ID: ${parcelReceiving.scheduleId}</h4>`;

            const noOfParcelsDiv = document.createElement("div");
            noOfParcelsDiv.classList.add("No-of-parcels");
            noOfParcelsDiv.innerHTML = `<h4>${parcelReceiving.pCount} Parcels</h4>`;

            listItem.appendChild(trainNoDiv); 
            listItem.appendChild(noOfParcelsDiv); 

            parcelList.appendChild(listItem); 
            }

        }

      });
  
    }
    catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
    }
});
