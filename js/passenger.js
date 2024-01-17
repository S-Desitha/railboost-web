// const url = "http://localhost:8080/railboost_backend_war_exploded/";



async function getSchedules() {
    const endpoint = "trainSchedule";
    let queryParams = new URLSearchParams(window.location.search);
    let schParams = JSON.parse(queryParams.get("schedule"));
    console.log(schParams);

    let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(schParams))}`;

    try {

        let schedules = await customFetch(urlQuery, {}, false);
        
        schedules.forEach(sch => {
            let viewButton = document.createElement("button");
            viewButton.classList.add("view-button");
            viewButton.innerHTML = "View <i class='fa-regular fa-eye'>";
            viewButton.onclick = function() {window.location.href = `/html/passenger/traintimes.html?scheduleId=${sch.scheduleId}&date=${schParams.date}`};
            
            let row = document.getElementById("schedule_table").insertRow(-1);
            row.insertCell(0).innerHTML = sch.scheduleId;
            row.insertCell(1).innerHTML = sch.trainId;
            row.insertCell(2).innerHTML = sch.startStation;
            row.insertCell(3).innerHTML = sch.endStation;
            row.insertCell(4).innerHTML = sch.trainType;
            row.insertCell(5).appendChild(viewButton);
        });
    } catch(error) {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }
}



async function getSchedule() {
    let queryParams = new URLSearchParams(window.location.search);
    let scheduleId = queryParams.get("scheduleId");
    let date = queryParams.get("date");
    let endpoint;
    let params = {scheduleId : scheduleId};


    if (date == new Date().toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"})){
        endpoint = "journey";
        params.date = date;

        let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(params))}`;

        try {
            let data = await customFetch(urlQuery, {}, false);
            createStoppingStations(data, "journey");
        } catch(error) {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        }
    }

    else {
        endpoint = "trainSchedule";
        params.date = date;

        let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(params))}`;

        try {
            let data = await customFetch(urlQuery, {}, false);
            createStoppingStations(data, "");
        } catch(error) {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        }
    }

}



function createStoppingStations(data, context) {
    if (Object.keys(data)) {
        data.stations.forEach(station => {
            let row = document.getElementById("schedule_stops").insertRow(-1);
            row.insertCell(0).innerHTML = station.station;
            row.insertCell(1).innerHTML = new Date('', '', '', station.scheduledArrivalTime.hour, station.scheduledArrivalTime.minute, station.scheduledArrivalTime.second).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
            row.insertCell(2).innerHTML = new Date('', '', '', station.scheduledDepartureTime.hour, station.scheduledDepartureTime.minute, station.scheduledDepartureTime.second).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
            if (context=="journey"){
                if (station.arrivalTime!=null)
                    row.insertCell(3).innerHTML = new Date('', '', '', station.arrivalTime.hour, station.arrivalTime.minute, station.arrivalTime.second).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
                else 
                    row.insertCell(3).innerHTML = '--';
                if (station.departureTime!=null)
                    row.insertCell(4).innerHTML = new Date('', '', '', station.departureTime.hour, station.departureTime.minute, station.departureTime.second).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
                else
                    row.insertCell(4).innerHTML = '--';
                }
            else {
                row.insertCell(3).innerHTML = '--';
                row.insertCell(4).innerHTML = '--';
            }
        });
    }
}