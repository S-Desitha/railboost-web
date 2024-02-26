// const url = "http://localhost:8080/railboost_backend_war_exploded/trainSchedule";


const scheduleEndpoint = "trainSchedule";

document.addEventListener("DOMContentLoaded", async function() {

    if (window.location.pathname.includes("schedule.html"))
        createSchedulesPage();
    else if (window.location.pathname.includes("trainSch.html"))
        createSpecificSchPage();
    
});

function addNewSchedule() {
    let schedule = localStorage.getItem("schedule");
    schedule = JSON.parse(schedule);

    schedule.startStation = document.getElementById("from").getAttribute("stationCode");
    schedule.endStation = document.getElementById("to").getAttribute("stationCode");
    schedule.scheduleId = document.getElementById("sch-id").value;
    schedule.trainId = document.getElementById("tr-id").value;
    schedule.speed = document.getElementById("speed").value;

    schedule.stations.forEach(st => {
        st.scheduleId = schedule.scheduleId;
    });

    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(schedule),
        method : "POST"
    };

    customFetch(scheduleEndpoint, params)
        .then(()=> {
            localStorage.removeItem("schedule");
            window.location.replace("/html/admin/schedule.html");
        })
        .catch((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });
}

function getSchedules() {
    let param = {
        date: new Date(document.getElementById("date").value).toLocaleDateString(),
        startStation: document.getElementById("start_station").value,
        endStation: document.getElementById("end_station").value
    }
    
    let urlQuery = url+`?json=${encodeURIComponent(JSON.stringify(param))}`;
    fetch(urlQuery, {})
        .then(response => response.json())
        .then(data => {
            data.forEach(sch => {
                let row = document.getElementById("schedule_table").insertRow(-1);
                row.insertCell(0).innerHTML = sch.scheduleId;
                row.insertCell(1).innerHTML = sch.trainId;
                row.insertCell(2).innerHTML = sch.startStation;
                row.insertCell(3).innerHTML = sch.endStation;
                row.insertCell(4).innerHTML = sch.speed;
                row.insertCell(5).innerHTML = `<a href="/html/admin/trainSch.html?scheduleId=${sch.scheduleId}"><button class="view-button">
                                                    View <i class="fa-regular fa-eye"></i></button>
                                                </a>`;
                row.insertCell(6).innerHTML = `<a href=""><button class="edit-button"><i class="fas fa-edit"></i> </button></a><a href=""><button class="delete-button"><i class="fas fa-trash"></i> </button></a>`;
            });

        });

}



function addStoppingStation(form) {
    let schedule = localStorage.getItem("schedule");
    schedule = schedule==null ? schedule = {stations: [], days: [], nStations:0} : JSON.parse(schedule);
    
    let button = document.getElementById("add_update-sch_station");
    
    station = {
        "scheduleId" : document.getElementById("sch-id").value,
        "station" : document.getElementById("stopping").getAttribute("stationCode"),
        "stationName" : document.getElementById("stopping").getElementsByTagName("div")[0].getElementsByTagName("span")[0].innerHTML,
        "scheduledArrivalTime" : document.getElementById("SAT").value,
        "scheduledDepartureTime" : document.getElementById("SDT").value
    };
    
    if (button.getAttribute("context") == "edit") {
        button.setAttribute("context", "");
        button.value = "Add a new Stopping";
        schedule.stations = schedule.stations.map(st => {
            if (st.stIndex==button.getAttribute("stIndex")) {
                station.stIndex = st.stIndex;        
                return station;
            }
            else 
                return st;
        });

        let row = document.getElementById("schedule_stations").rows[station.stIndex-1];
        row.setAttribute("stationCode", station.station);
        row.cells[0].innerHTML = station.stationName;
        row.cells[1].innerHTML = station.scheduledArrivalTime;
        row.cells[2].innerHTML = station.scheduledDepartureTime;
    }

    else {
        station.stIndex = schedule.nStations+1;
        schedule.stations.push(station);
        insertStationToPage(station);
        schedule.nStations++;
    }

    document.getElementById("station-form").reset();
    localStorage.setItem("schedule", JSON.stringify(schedule));

}



function insertStationToPage(station) {
    let row = document.getElementById("schedule_stations").insertRow(-1);
    row.setAttribute("stationCode", station.station);

    let editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.innerHTML = "<i class='fas fa-edit'></i>";
    editButton.onclick = editStation;

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "<i class='fas fa-trash'></i>";

    row.insertCell(0).innerHTML = station.stationName;
    row.insertCell(1).innerHTML = station.scheduledArrivalTime;
    row.insertCell(2).innerHTML = station.scheduledDepartureTime;
    row.insertCell(3).append(editButton, deleteButton);
}



/**
 * Summary. 
 */
function editStation() {
    let stationCode = this.parentNode.parentNode.getAttribute("stationCode");

    let button = document.getElementById("add_update-sch_station")
    button.value = "Update Station";
    button.setAttribute("context", "edit");
    
    let station = JSON.parse(localStorage.getItem("schedule")).stations
    .find((elmnt) => elmnt.station==stationCode);
    
    button.setAttribute("stIndex", station.stIndex);

    document.getElementById("stopping").getElementsByTagName("span")[0].innerHTML = station.stationName;
    document.getElementById("stopping").setAttribute("stationCode", station.station);

    document.getElementById("SAT").value = station.scheduledArrivalTime;
    document.getElementById("SDT").value = station.scheduledDepartureTime; 

}



function viewStations() {
    let dialog = document.querySelector(".stations-data-modal");
    let stations = JSON.parse(this.getAttribute("stations"));
    
    stations.forEach(station => {
        let row = document.getElementById("schedule_stations").insertRow(-1);
        row.insertCell(0).innerHTML = station.station;
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



async function createSchedulesPage() {
    let param = {
        date: new Date().toLocaleDateString(
            'en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }
        )
    }
    
    let urlQuery = scheduleEndpoint+`?json=${encodeURIComponent(JSON.stringify(param))}`;

    try {
        let data = await customFetch(urlQuery, param);
        console.log(data);
        data.forEach(sch => {
            // let viewButton = document.createElement("button");
            // viewButton.classList.add("view-button");
            // viewButton.innerHTML = "<i class='fa-regular fa-eye'></i>";
            // viewButton.setAttribute("schedule", JSON.stringify(sch));
            // viewButton.onclick = viewStations;

            let infoButton = document.createElement("button");
            infoButton.classList.add("edit-button");
            infoButton.classList.add("data-open-modal");
            infoButton.innerHTML = "<i class='fa-solid fa-circle-info'></i>";
            infoButton.setAttribute("stations", JSON.stringify(sch.stations));
            infoButton.onclick = viewStations;

            let editButton = document.createElement("button");
            editButton.classList.add("edit-button");
            editButton.innerHTML = "<i class='fas fa-edit'></i>";
            // editButton.onclick = editStation;

            let deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = "<i class='fas fa-trash'></i>";

            let row = document.getElementById("schedule_table").insertRow(-1);
            row.insertCell(0).innerHTML = sch.scheduleId;
            row.insertCell(1).innerHTML = sch.trainId;
            row.insertCell(2).innerHTML = sch.startStation;
            row.insertCell(3).innerHTML = sch.endStation;
            row.insertCell(4).innerHTML = sch.trainType;
            // row.insertCell(5).innerHTML = `<a href="/html/admin/trainSch.html?scheduleId=${sch.scheduleId}"><button class="view-button">
            //                                     View <i class="fa-regular fa-eye"></i></button>
            //                                 </a>`;
            // row.insertCell(6).innerHTML = `<a href=""><button class="edit-button"><i class="fas fa-edit"></i> </button></a><a href=""><button class="delete-button"><i class="fas fa-trash"></i> </button></a>`;
            row.insertCell(5).append(infoButton, editButton, deleteButton);
        })
    }
    catch(error) {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }
}



function createSpecificSchPage() {
    let schedule = localStorage.getItem("schedule");

    if (schedule!=null) {
        schedule = JSON.parse(schedule);

        schedule.stations.forEach(station => insertStationToPage(station));
    }
}



function editSchedule() {
    console.log("Edit schedule");
    const schedule = JSON.parse(this.getAttribute("schedule"));

    const button = document.getElementById("add_update-schedule-button");

    button.setAttribute("schedule", JSON.stringify(schedule));

    document.getElementById("add_update-schedule-header").innerHTML = "Update Schedule";
    button.innerHTML = "Update";

    document.getElementById("scheduleId").value = schedule["scheduleId"];
    document.getElementById("trainId").value = schedule["trainId"];
    document.getElementById("start-station").value = schedule["startStation"];
    document.getElementById("end-station").value = schedule["endStation"];

    button.onclick = updateSchedule;
}


function deleteSchedule() {
    console.log("Delete Schedule");
    const schedule = JSON.parse(this.getAttribute("schedule"));
    const id = schedule["scheduleId"];

    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        method : "DELETE",
        credentials : "include"
    };

    fetch(url+"?scheduleId="+id, params)
    .then(res => {
        if(res.ok){
            window.location.reload();
        }
    });
}



function updateSchedule() {
    const original = JSON.parse(this.getAttribute("schedule"));
    let updated = Object.assign({}, original);

    updated["scheduleId"] = document.getElementById("scheduleId").value;
    updated["trainId"] = document.getElementById("trainId").value;
    updated["startStation"] = document.getElementById("start-station").value;
    updated["endStation"] = document.getElementById("end-station").value;

    const body = [original, updated];
    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(body),
        method : "PUT",
        credentials : "include"
    };

    fetch(url, params)
    .then(res => {
        if(res.ok) {
            window.location.reload();
        }
    });
}



// function addNewSchedule() {
//     console.log("Add new train schedule");
//     schedule = {
//         stations: []
//     };
//     schedule["scheduleId"] = document.getElementById("scheduleId").value;
//     schedule["trainId"] = document.getElementById("trainId").value;
//     schedule["startStation"] = document.getElementById("start-station").value;
//     schedule["endStation"] = document.getElementById("end-station").value;

//     window.location.href = "trainSch.html?addNew=true&schedule="+encodeURIComponent(JSON.stringify(schedule));

//     // console.log(schedule);

//     // const body = schedule;
//     // const params = {
//     //     headers : {
//     //         "Content-type": "application/json; charset=UTF-8"
//     //     },
//     //     body : JSON.stringify(body),
//     //     method : "POST",
//     //     credentials : "include"
//     // };

//     // fetch(url, params)
//     // .then(res => {
//     //     if(res.ok) {
//     //         window.location.reload();
//     //     }
//     // });
// }

