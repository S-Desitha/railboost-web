// const url = "http://localhost:8080/railboost_backend_war_exploded/journey";
const endpoint = "journey";


async function createJourneys() {
    let param = {
        date: new Date().toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"})
    }
    // Get the journeys from the backend
    let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(param))}`;

    let data = await customFetch(urlQuery, {credentials:"include"});
    
    console.log(data);
    // Create a table row for each journey
    if (Object.keys(data)){
        data.forEach(journey => {
            let row = document.getElementById("schedule_table").insertRow(-1);
            row.insertCell(0).innerHTML = journey.scheduleId;
            row.insertCell(1).innerHTML = journey.schedule.trainId;
            row.insertCell(2).innerHTML = journey.schedule.startStation;
            row.insertCell(3).innerHTML = journey.schedule.endStation;
            row.insertCell(4).innerHTML = journey.schedule.trainType;
            row.insertCell(5).innerHTML = `<a href="/html/sm/sm-update.html?scheduleId=${journey.scheduleId}"><button class="view-button">
                                                Update <i class="fa-solid fa-pen-to-square"></i></button>
                                            </a>`;
        });
    }           
}



async function createJourney() {
    let param = {
        date: new Date().toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"}),
        scheduleId: new URLSearchParams(window.location.search).get("scheduleId")
        // scheduleId: 8710
    }

    let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(param))}`;
    let data = await customFetch(urlQuery, {credentials:"include"})
    
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

            row.insertCell(0).innerHTML = js.station;
            row.insertCell(1).innerHTML = new Date('', '', '', js.scheduledArrivalTime.hour, js.scheduledArrivalTime.minute, js.scheduledArrivalTime.second).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
            row.insertCell(2).innerHTML = new Date('', '', '', js.scheduledDepartureTime.hour, js.scheduledDepartureTime.minute, js.scheduledDepartureTime.second).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
            if (js.arrivalTime==null)
                row.insertCell(3).appendChild(arrivalButton);
            else
                row.insertCell(3).innerHTML = new Date('', '', '', js.arrivalTime.hour, js.arrivalTime.minute, js.arrivalTime.second).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
            if (js.departureTime==null)
                row.insertCell(4).appendChild(departureButton);
            else
                row.insertCell(4).innerHTML = new Date('', '', '', js.departureTime.hour, js.departureTime.minute, js.departureTime.second).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});

        });
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
        method: "PUT",
        credentials: "include"
    };

    console.log(params);

    let data = await customFetch(endpoint, params);
    console.log(data.status);
    if (data.status==200) {
        if (timeType=="arrival")
            document.getElementById(station).cells[3].innerHTML = time;
        else if (timeType=="departure")
            document.getElementById(station).cells[4].innerHTML = time;
    }
    else if (data.status==403) {
        alert(`You don't have permission to update station: ${station}`);
    }
}



