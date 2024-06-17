function getStationInfo(array, selectedStation) {
    const stationInfo = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i].station === selectedStation) {
            stationInfo.push({
                stationName: array[i].stationName,
                scheduledArrivalTime: array[i].scheduledArrivalTime
            });
        }
    }
    return stationInfo.length > 0 ? stationInfo : null; // Return the array of station info or null if station is not found
}
function calculateDuration(startStationInfo, endStationInfo) {
    if (startStationInfo && endStationInfo) {
       
        const startTime = startStationInfo[0].scheduledArrivalTime.split(":").map(Number);
        const endTime = endStationInfo[0].scheduledArrivalTime.split(":").map(Number);
        
        const startInMinutes = startTime[0] * 60 + startTime[1];
        const endInMinutes = endTime[0] * 60 + endTime[1];
        
        const durationMinutes = endInMinutes - startInMinutes;
        return durationMinutes;
    } else {
        return null; // Return null if either start or end station info is missing
    }
}
async function getSchedules() {
    console.log("Getting schedules");
    const endpoint = "trainSchedule";
    let queryParams = new URLSearchParams(window.location.search);
    let schParams = JSON.parse(queryParams.get("schedule"));
    console.log(schParams);

    let urlQuery = endpoint + `?json=${encodeURIComponent(JSON.stringify(schParams))}`;

    try {

        let schedules = await customFetch(urlQuery, {}, false);
        console.log(schedules);


        const trainContainersDiv = document.getElementById('train-containers');
        schedules.forEach(sch => {
            // Create a new train container for each schedule
            let trainContainer = document.createElement('div');
            trainContainer.classList.add('train');
            console.log(sch.stations);
            console.log(schParams.startStation);
            console.log(schParams.endStation);
            const startStationInfo = getStationInfo(sch.stations, schParams.startStation);
            console.log("Start Station Info:", startStationInfo);
            console.log(startStationInfo[0].stationName);

            const endStationInfo = getStationInfo(sch.stations, schParams.endStation);
            console.log("End Station Info:", endStationInfo);

            const duration = calculateDuration(startStationInfo, endStationInfo);
            console.log("Duration (minutes):", duration);
            trainContainer.innerHTML = `

                
                <div class="train-heading">
                    <i class="fas fa-train"></i>
                    <div class="train-info">
                        <div class="SnE-stations">
                            <div class="sstation">
                                <p> <b>${sch.startStationName}</b> <i class="fa-solid fa-play"></i> </p>
                            </div>
                            <div class="dstation">
                                <p style="margin-left:10px"> <b>${sch.endStationName}</b> </p>
                            </div>
                        </div>
                        <div class="tnum-speed">
                            <div class="train-number">
                                <p> <b>${sch.scheduleId}</b> </p>
                            </div>
                            <div class="speed">
                                <p> <b>${sch.speed}</b> </p>
                            </div>
                        </div>
                    </div>
                    <button class="stopping-stations-button">Stopping Stations</button>
                </div>
                <div class="selected-info">
                    <div class="start">
                        <div class="stime">
                            <p> <b>${startStationInfo[0].scheduledArrivalTime}</b> </p>
                        </div>
                        <div class="selected-sstation">
                            <p> <b>${startStationInfo[0].stationName}</b> </p>
                        </div>
                    </div>
                    <div class="duration-n">
                        <div class="dots">
                            <p id="icons-container"></p>
                        </div>
                        <div class="mins">
                            <p> <b>${duration} mins</b> </p>
                        </div>
                    </div>
                    <div class="end" style="align-items:right">
                        <div class="etime">
                            <p> <b >${endStationInfo[0].scheduledArrivalTime}</b> </p>
                        </div>
                        <div class="selected-estation">
                            <p> <b>${endStationInfo[0].stationName}</b> </p>
                        </div>
                    </div>
                </div>
            `;

            // Append the new train container to the document body
            trainContainersDiv.appendChild(trainContainer);
            document.getElementById("selectedsstation").querySelector('p').innerHTML = `${startStationInfo[0].stationName} &nbsp <i  class="fa-solid fa-play"></i>`;
            document.getElementById("selecteddstation").querySelector('p').innerHTML = `${endStationInfo[0].stationName}`;

            // Handle button click event
            let stopButton = trainContainer.querySelector(".stopping-stations-button");
            // stopButton.onclick = function() {
            //     window.location.href = `/html/passenger/traintimes.html?scheduleId=${sch.scheduleId}&date=${schParams.date}`;
            // };

            // let infoButton = document.createElement("button");
            // infoButton.classList.add("edit-button");
            // infoButton.classList.add("data-open-modal");
            // infoButton.innerHTML = "<i class='fa-solid fa-circle-info'></i>";
            // stopButton.setAttribute("stations", JSON.stringify(sch.stations));
            stopButton.setAttribute("schedules", JSON.stringify(sch));
            
            // stopButton.appendChild(infoButton);
            stopButton.onclick = function(){ getSchedule(sch.scheduleId,schParams.date);}
            // Get the dialog modal
           // Get the dialog modal
            // var dialogModal = document.querySelector(".dialog-modal");

            // // Get the iframe inside the dialog
            // var modalFrame = dialogModal.querySelector("#modalFrame");

            // // When the button is clicked, open the dialog modal, load content into the iframe, and call popupAddPage function
            // stopButton.onclick = function() {
            //     popupAddPage('.dialog-modal'); // Call popupAddPage function
            //     modalFrame.src = `/html/passenger/traintimes.html?scheduleId=${sch.scheduleId}&date=${schParams.date}`; // Load content into the iframe
            // }

            // // Close the dialog modal when the close button is clicked
            // dialogModal.querySelector(".close").addEventListener("click", function() {
            //     dialogModal.close(); // Close the dialog modal
            // });



            // Add dots to the corresponding dots container
            let iconsContainer = trainContainer.querySelector(`#icons-container`);
            for (let i = 0; i < 25; i++) {
                const icon = document.createElement('i');
                icon.classList.add('fa', 'fa-solid', 'fa-circle');
                iconsContainer.appendChild(icon);
            }
        });
    } catch (error) {
        if (error == "login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }
}




async function getSchedule(scheduleID, Cdate) {
    console.log("Getting schedule in passneger.js");
    // let queryParams = new URLSearchParams(window.location.search)
    // let queryParams = new URLSearchParams(window.location.search);
    // let schParams = JSON.parse(queryParams.get("schedule"));;
    let scheduleId = scheduleID;
    let date = Cdate;
    console.log(scheduleId);
    console.log(date);
    // display

    let endpoint;
    let params = {scheduleId : scheduleId};


    if (date == new Date().toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"})){
        endpoint = "journey";
        params.date = date;

        let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(params))}`;

        try {
            let data = await customFetch(urlQuery, {}, false);
            console.log(data);
            createStoppingStations(data, "journey");
        } catch(error) {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        }
    }

    else {
        endpoint = "trainSchedule";
        params.date = date;
        console.log("Not the current date ");

        let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(params))}`;

        try {
            let data = await customFetch(urlQuery, {}, false);

           


            console.log("trainschedule data "+ data);
            createStoppingStations(data, "");
        } catch(error) {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        }
    }

}
function viewStations(scheduleId) {
    let schedule = JSON.parse(localStorage.getItem("scheduleList")).find(sch => sch.scheduleId==scheduleId);
    let stations = schedule.stations;
    let dialog = document.querySelector(".dialog-modal");

    document.getElementById("start-from-date").innerHTML = schedule.startDate;
    if (schedule.endDate!=null)
        document.getElementById("ends-on-date").innerHTML = schedule.endDate;
    else
    document.getElementById("ends-on-date").innerHTML = "Continuous";


    document.querySelectorAll(".cat.day input[type='checkbox']").forEach(checkBox => {
        checkBox.checked = false;
        checkBox.disabled = true;
    });

    schedule.days.forEach(day => {
        let prefix = day.day.substring(0,3).toLowerCase();
        console.log(prefix);
        document.getElementById(prefix).checked = true;
    })
    
    stations.forEach(station => {
        let row = document.getElementById("schedule_stations").insertRow(-1);
        row.insertCell(0).innerHTML = station.stationName;
        row.insertCell(1).innerHTML = station.scheduledArrivalTime;
        row.insertCell(2).innerHTML = station.scheduledDepartureTime;
    });

    dialog.showModal();

    dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect()
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          dialog.close()
        }
    });
}




function createStoppingStations(data, context) {
    clearTable();
    console.log(data);
    if (Object.keys(data)) {

        document.getElementById('sstation').textContent = data.schedule.startStationName;
        document.getElementById('dstation').textContent = data.schedule.endStationName;
        document.getElementById('tnum').textContent = data.schedule.scheduleId;
        document.getElementById('tspeed').textContent = data.schedule.speed;
    //     if (data.schedule.endDate!=null)
    //      document.getElementById("ends-on-date").innerHTML = data.schedule.endDate;
    //     else
    // document.getElementById("ends-on-date").innerHTML = "Continuous";


    document.querySelectorAll(".cat.day input[type='checkbox']").forEach(checkBox => {
        checkBox.checked = false;
        checkBox.disabled = true;
    });

    data.schedule.days.forEach(day => {
        let prefix = day.day.substring(0,3).toLowerCase();
        console.log(prefix);
        document.getElementById(prefix).checked = true;
    })
    data.stations.forEach(station => {
            
            let row = document.getElementById("schedule_stops").insertRow(-1);
            row.insertCell(0).innerHTML = station.stationName;
            row.insertCell(1).innerHTML = new Date('', '', '', station.scheduledArrivalTime.split(":")[0], station.scheduledArrivalTime.split(":")[1], station.scheduledArrivalTime.split(":")[2]).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
            row.insertCell(2).innerHTML = new Date('', '', '', station.scheduledDepartureTime.split(":")[0], station.scheduledDepartureTime.split(":")[1], station.scheduledDepartureTime.split(":")[2]).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
            
            if (context=="journey"){
                console.log("Context is Journey");
                if (station.arrivalTime!=null)
                
                    // row.insertCell(3).innerHTML = new Date(station.arrivalTime).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
                    row.insertCell(3).innerHTML = new Date('', '', '', station.arrivalTime.split(":")[0], station.arrivalTime.split(":")[1], station.arrivalTime.split(":")[2]).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
                else 
                    row.insertCell(3).innerHTML = '--';
                if (station.departureTime!=null)
                    row.insertCell(4).innerHTML = new Date('', '', '', station.departureTime.split(":")[0], station.departureTime.split(":")[1], station.departureTime.split(":")[2]).toLocaleTimeString(navigator.language||navigator.languages[0], {hour12: false});
                else
                    row.insertCell(4).innerHTML = '--';
                }
            else {
                row.insertCell(3).innerHTML = '--';
                row.insertCell(4).innerHTML = '--';
            }
            let dialog = document.querySelector(".dialog-modal");
            dialog.showModal();
            
            
        });
    }
}
function clearTable() {
    let table = document.getElementById("schedule_stops");
    while (table.rows.length > 0) { // Remove all rows
        table.deleteRow(0);
    }
}