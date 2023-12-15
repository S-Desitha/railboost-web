const url = "http://localhost:8080/railboost_backend_war_exploded/journey";


function getJourneys() {
    let param = {
        date: "2023-12-09"
    }
    // Get the journeys from the backend
    let urlQuery = url+`?json=${encodeURIComponent(JSON.stringify(param))}`;
    fetch(urlQuery, {credentials:"include"})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Create a table row for each journey
            if (!Object.keys(data)){
                data.forEach(journey => {
                    let row = document.createElement("tr");
                    row.innerHTML = `<td>${journey.scheduleId}</td>
                                     <td>${journey.schedule.trainId}</td>
                                     <td>${journey.schedule.startStation}</td>
                                     <td>${journey.schedule.endStation}</td>
                                     <td>${journey.schedule.trainType}</td>
                                     <td><a href="/html/sm/sm-update.html?scheduleId=${journey.scheduleId}"><button class="view-button">
                                     Update <i class="fa-solid fa-pen-to-square"></i></button>
                                    </a></td>`;
                    document.getElementById("schedule_table").appendChild(row);
                });
            }
        });   
}



function getJourney() {
    let param = {
        date: "2023-12-09",
        scheduleId: new URLSearchParams(window.location.search).get("scheduleId")
    }
    
    console.log(param);


    let urlQuery = url+`?json=${encodeURIComponent(JSON.stringify(param))}`;
    fetch(urlQuery, {credentials:"include"})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Create a table row for each journey
            if (!Object.keys(data)){
                let n_stations = data.stations.length;
                let stations = [];
                for (let i = 0; i <n; i++) {
                    if (data.stations[i].stIndex==i){
                        stations.push(data.stations[i]);

                        for (let j=0; j<n_stations; j++) {
                            if (data.schedule.stations[j].stIndex==i) {
                                stations[i].scheduledArrivalTime = data.schedule.stations[j].scheduledArrivalTime;
                                stations[i].scheduledDepartureTime = data.schedule.stations[j].scheduledDepartureTime;
                            }
                        }
                    }
                }
                stations.forEach(journey_station => {
                    let row = document.createElement("tr");
                    row.innerHTML = `<td>${journey_station.station}</td>
                                     <td>${journey_station.scheduledArrivalTime}</td>
                                     <td>${journey_station.scheduledDepartureTime}</td>
                                     <td>${journey_station.arrivalTime}</td>
                                     <td>${journey_station.departureTime}</td>
                                     <td>
                                        <a href="#" onclick="updateTime(this, 'arrivedTime')"><button class="view-button">
                                            Arrived <i class="fa-solid fa-arrow-down"></i></button>
                                        </a>
                                    </td>
                                    <td>
                                        <a href="#" onclick="updateTime(this, 'departuredTime')"><button class="view-button">
                                            Departured <i class="fa-solid fa-arrow-up"></i></button>
                                        </a>
                                    </td>`;
                    document.getElementById("journey_table").appendChild(row);
                });
            }

        });   
}