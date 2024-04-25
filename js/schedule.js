// const url = "http://localhost:8080/railboost_backend_war_exploded/trainSchedule";


const scheduleEndpoint = "trainSchedule";

document.addEventListener("DOMContentLoaded", async function() {

    if (window.location.pathname.includes("schedule.html"))
        createSchedulesPage();
    else if (window.location.pathname.includes("trainSch.html")) {
        createSpecificSchPage();
        dynamicDraggableTable();

        const endpoint = "train";
    const selectElement = document.getElementById("train-id");

    try {
        // Fetch train IDs from the backend
        const data = await customFetch(endpoint, {});
        console.log(data);

        // Clear existing options
        selectElement.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = "Select Train ID";
        selectElement.appendChild(defaultOption);

        // Populate dropdown with fetched train IDs
        data.forEach(train => {
            const option = document.createElement("option");
            option.value = train.trainId;
            option.textContent = train.trainId;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching train IDs:", error);
    }
    }

});




function addStoppingStation() {
    let schedule = getSchedule();

    let button = document.getElementById("add_update-sch_station");
    
    station = {
        // "scheduleId" : document.getElementById("sch-id").value,
        "station" : document.getElementById("stopping").getAttribute("stationCode"),
        "stationName" : document.getElementById("stopping").getElementsByTagName("div")[0].getElementsByTagName("span")[0].innerHTML,
        "scheduledArrivalTime" : document.getElementById("SAT").value,
        "scheduledDepartureTime" : document.getElementById("SDT").value
    };
    
    if (button.getAttribute("context") == "edit") {

        schedule.stations.update(station, "edit");
 
        let row = Array.from(document.getElementById("schedule_stations").rows).filter(row => row.getAttribute("tag")=="edit")[0];
        row.setAttribute("stationCode", station.station);
        row.cells[0].innerHTML = station.stationName;
        row.cells[1].innerHTML = station.scheduledArrivalTime;
        row.cells[2].innerHTML = station.scheduledDepartureTime;
        

        row.removeAttribute("tag");
        button.setAttribute("context", "");
        button.value = "Add a new Stopping";
    }

    else {
        schedule.stations.push(new Node(station));
        insertStationToPage(station);
        schedule.nStations++;
    }

    document.getElementById("station-form").reset();

    saveSchedule(schedule);
    validateStations();
    dynamicDraggableTable();
}






function addNewSchedule() {
    let schedule = getSchedule();
    let serialSchedule = schedule;
    
    let [startDate, days, endDate] = getDates();
    startDate = startDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    endDate = endDate != null ? endDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : endDate;
    
    serialSchedule.stations = schedule.stations.toArray();
    serialSchedule.startDate = startDate;
    serialSchedule.endDate = endDate;
    serialSchedule.days = days;
    
    serialSchedule.startStation = document.getElementById("from").getAttribute("stationCode");
    serialSchedule.endStation = document.getElementById("to").getAttribute("stationCode");
    serialSchedule.scheduleId = document.getElementById("sch-id").value;
    serialSchedule.trainId = document.getElementById("train-id").value;
    serialSchedule.speed = document.getElementById("speed").value;

    const params = {
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(serialSchedule),
        method: "POST"
    };

    customFetch(scheduleEndpoint, params)
        .then(() => {
            // Display SweetAlert notification
            Swal.fire({
                icon: 'success',
                title: 'Schedule Added!',
                text: `New schedule added from ${document.getElementById("from").getAttribute("stationName")} to ${document.getElementById("to").getAttribute("stationName")}.`,
                confirmButtonText: 'OK'
            }).then(() => {
                localStorage.removeItem("NewscheduleCache");
                window.location.replace("/html/admin/schedule.html");
            });
        })
        .catch((error) => {
            if (error == "login-redirected")
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
                row.insertCell(5).innerHTML = `<a href="/html/admin/trainSch.html?scheduleId=${sch.scheduleId}"><button class="view-button" >
                                                    View <i class="fa-regular fa-eye"></i></button>
                                                </a>`;
                row.insertCell(6).innerHTML = `<a href=""><button class="edit-button"><i class="fas fa-edit"></i> </button></a><a href=""><button class="delete-button"><i class="fas fa-trash"></i> </button></a>`;
            });

        });

}




function insertStationToPage(station) {
    let row = document.getElementById("schedule_stations").insertRow(-1);
    row.setAttribute("stationCode", station.station);

    let editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.innerHTML = "<i class='fas fa-edit'></i>";
    editButton.onclick = editStopStation;

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
    deleteButton.onclick = deleteStopStation;

    row.insertCell(0).innerHTML = station.stationName;
    row.insertCell(1).innerHTML = station.scheduledArrivalTime;
    row.insertCell(2).innerHTML = station.scheduledDepartureTime;
    row.insertCell(3).append(editButton, deleteButton);
}




function editStopStation() {
    this.closest("tr").setAttribute("tag", "edit");
    
    let stationCode = this.closest("tr").getAttribute("stationCode");
    let schedule = getSchedule();

    schedule.stations.tagNode(stationCode, "edit");
    saveSchedule(schedule);

    let button = document.getElementById("add_update-sch_station")
    button.value = "Update Station Times";
    button.setAttribute("context", "edit");
    
    let station = JSON.parse(localStorage.getItem("NewscheduleCache")).stations
    .find((elmnt) => elmnt.station==stationCode);
    
    button.setAttribute("stIndex", station.stIndex);

    document.getElementById("stopping").getElementsByTagName("span")[0].innerHTML = station.stationName;
    document.getElementById("stopping").setAttribute("stationCode", station.station);

    document.getElementById("SAT").value = station.scheduledArrivalTime;
    document.getElementById("SDT").value = station.scheduledDepartureTime; 

    popupAddPage('.dialog-modal')
}



function deleteStopStation() {
    let stationCode = this.closest("tr").getAttribute("stationCode");
    let schedule = getSchedule();

    schedule.stations.removeNode('station', stationCode);
    saveSchedule(schedule);

    this.closest("tr").remove();
    dynamicDraggableTable();
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



async function createSchedulesPage() {
    const nextUrl = "/html/admin/trainSch.html";
    const key = "scheduleId";

    let param = {
        // date: new Date().toLocaleDateString(
        //     'en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }
        // )
    }
    
    let urlQuery = scheduleEndpoint+`?json=${encodeURIComponent(JSON.stringify(param))}`;

    try {
        let data = await customFetch(urlQuery, param);
        localStorage.setItem("scheduleList", JSON.stringify(data));
        console.log(data);
        data.forEach(sch => {
            let value = sch.scheduleId;
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
            infoButton.onclick = function(){ viewStations(sch.scheduleId);}

            let editButton = document.createElement("button");
            editButton.classList.add("edit-button");
            editButton.innerHTML = "<i class='fas fa-edit'></i>";
            editButton.onclick = () => {window.location.href = `${nextUrl}?${key}=${value}`;}
            // editButton.onclick = editStation;

            let deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
            deleteButton.setAttribute("scheduleId", sch.scheduleId);
            deleteButton.onclick = deleteSchedule;

            let row = document.getElementById("schedule_table").insertRow(-1);
            row.insertCell(0).innerHTML = sch.scheduleId;
            row.insertCell(1).innerHTML = sch.trainId;
            row.insertCell(2).innerHTML = sch.startStationName;
            row.insertCell(3).innerHTML = sch.endStationName;
            row.insertCell(4).innerHTML = sch.speed;
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



async function createSpecificSchPage() {
    const scheduleId = new URLSearchParams(window.location.search).get('scheduleId');

    if (scheduleId!=null) {
        if (localStorage.getItem("scheduleType")==null)
            localStorage.setItem("scheduleType", "edit");
        else
            setEditSchPriority();

        
        let scheduleList = JSON.parse(localStorage.getItem("scheduleList"));
        let serialSchedule = scheduleList.find(element => element.scheduleId == scheduleId);

        serialSchedule.stations.forEach(station => insertStationToPage(station));

        let button = document.getElementById("submit-schedule-btn");
        button.innerHTML = "Update Schedule";
        button.onclick = updateSchedule;

        console.log(serialSchedule);

        // form.setAttribute("onsubmit", "updateSchedule");
        document.getElementById("submit-schedule-btn").value = "Update Schedule"
        document.getElementById("sch-id").value = serialSchedule.scheduleId;
        document.getElementById("train-id").value = serialSchedule.trainId;

        document.getElementById("from").setAttribute("stationCode", serialSchedule.startStation);
        document.getElementById("to").setAttribute("stationCode", serialSchedule.endStation);
        document.getElementById("speed").value = serialSchedule.speed;
        document.getElementById("sch-id").disabled = true;

        document.getElementById("from").getElementsByTagName("span")[0].innerHTML = serialSchedule.startStationName;
     document.getElementById("to").getElementsByTagName("span")[0].innerHTML= serialSchedule.endStationName;

        localStorage.setItem("NewscheduleCache", JSON.stringify(serialSchedule));
    }
    else {
        if (localStorage.getItem("scheduleType")==null)
            localStorage.setItem("scheduleType", "add");
        else
            setAddSchPriority();

        let schedule = localStorage.getItem("NewscheduleCache");
        if (schedule!=null) {
            schedule = JSON.parse(schedule);
            schedule.stations.forEach(station => insertStationToPage(station));

            validateStations();
        }
    }

    

    
}



function editSchedule() {
    console.log("Edit schedule");
    const schedule = JSON.parse(this.getAttribute("schedule"));

    const button = document.getElementById("add_update-schedule-button");

    button.setAttribute("schedule", JSON.stringify(schedule));

    document.getElementById("add_update-schedule-header").innerHTML = "Update Schedule";
    button.innerHTML = "Update";
    console.log(schedule);
    document.getElementById("scheduleId").value = schedule["scheduleId"];
    document.getElementById("train-id").value = schedule["trainId"];
     
     document.getElementById("from").getElementsByTagName("span")[0].innerHTML = schedule["startStation"];
     document.getElementById("to").getElementsByTagName("span")[0].innerHTML= schedule["endStation"];

    button.onclick = updateSchedule;
}


function deleteSchedule() {
    const scheduleId = JSON.parse(this.getAttribute("scheduleId"));
    
    // Show confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this schedule!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // If confirmed, proceed with deletion
            const url_query = scheduleEndpoint + "?scheduleId=" + scheduleId;
            const params = {
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                method: "DELETE"
            };

            customFetch(url_query, params)
                .then(() => {
                    // Show success message after deletion
                    Swal.fire('Deleted!', 'The schedule has been deleted.', 'success').then(() => {
                        window.location.reload();
                    });
                })
                .catch((error) => {
                    if (error == "login-redirected")
                        localStorage.setItem("last_url", window.location.pathname);
                });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // If canceled, show a message
            Swal.fire('Cancelled', 'Your schedule is safe :)', 'error');
        }
    });
}


function updateSchedule() {
    const updated = getSchedule();
    const original = JSON.parse(localStorage.getItem("scheduleList")).find(schedule => schedule.scheduleId == updated.scheduleId);
    const scheduleId = original.scheduleId;

    updated.stations = updated.stations.toArray();
    
    updated.stations = updated.stations.map(st => {st.scheduleId = scheduleId; return st;});
    updated.days = updated.days.map(day => {day.scheduleId = scheduleId; return day;});

    console.log(original);
    console.log(updated);

    let [startDate, days, endDate] = getDates();
    if (!(startDate==null && days==null && endDate==null)) {
        startDate = startDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        endDate = endDate!=null? endDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : endDate;
        
        updated.startDate = startDate;
        updated.endDate = endDate;
        updated.days = days;
    }
    
    
    updated.startStation = document.getElementById("from").getAttribute("stationCode");
    updated.endStation = document.getElementById("to").getAttribute("stationCode");
    // updated.scheduleId = document.getElementById("sch-id").value;
    updated.trainId = document.getElementById("train-id").value;
    updated.speed = document.getElementById("speed").value;

    const body = [original, updated];
    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(body),
        method : "PUT",
        credentials : "include"
    };

    // fetch(url, params)
    // .then(res => {
    //     if(res.ok) {
    //         window.location.reload();
    //     }
    // });
    customFetch(scheduleEndpoint, params)
        .then(() => window.location.href = "/html/admin/schedule.html")
        .catch ((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });
}



function getDates() {
    const dayIds = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    let unit = document.getElementById("repeat-unit").value;
    let startDate;
    let days = [];
    let endDate = function() {
        let grpName = "ends-option";
        let radioValue = document.querySelector(`input[type="radio"][name="${grpName}"]:checked`).value;
        switch (radioValue) {
            case "never" :
                return null;
                break;
            case "on-date" :
                return new Date(document.getElementById("ends-on-date").value);
                break;
            case "after-occurrences" :
                let nOccurences = parseInt(document.getElementById("ends-after-occurrences").value);
                return (() => {
                    if (unit=="day") {
                        return new Date(startDate.getTime() + nOccurences * 24 * 60 * 60 * 1000);
                    }
                    else if(unit=="week") {
                        return new Date(startDate.getTime() + nOccurences * 7 * 24 * 60 * 60 * 1000);
                    }
                })();
        }
    }

    if (unit=="null")
        return [null, null, null]
    else {
        switch (unit) {
            case "day" :
                startDate = new Date(document.getElementById("start-from-date").value);
                break;

            case "week" :
                startDate = new Date(document.getElementById("start-from-date").value);
                dayIds.forEach(dayId => {
                    let checkBox = document.getElementById(dayId);
                    if (checkBox.checked)
                        days.push({"day":checkBox.value});
                });
                break;

            case "month" :

                
        }
    }
    return [startDate, days, endDate()];
}



function popupDatePicker(classname) {
    let dialog = document.querySelector(classname);

    dialog.showModal();


    var repeatUnit = document.getElementById("repeat-unit");
    var repeatOn = document.getElementById("repeat-on");
    var container = document.getElementById("container");
    var ycontainer = document.getElementById("y-container");
    var mcontainer = document.getElementById("m-container");

    repeatUnit.addEventListener("change", function () {
        if (repeatUnit.value === "day") {
            repeatOn.style.display = "none";
            container.style.display = "none";
            ycontainer.style.display = "none";
            mcontainer.style.display = "none";
        } else if (repeatUnit.value === "month") {
            repeatOn.style.display = "block";
            container.style.display = "none";
            ycontainer.style.display = "none";
            mcontainer.style.display = "block";
        }else if (repeatUnit.value === "year") {
            repeatOn.style.display = "block";
            container.style.display = "none";
            ycontainer.style.display = "block";
            mcontainer.style.display = "none";
        }else{
            repeatOn.style.display = "block";
            container.style.display = "block";
            ycontainer.style.display = "none";
            mcontainer.style.display = "none";
        }
    });
    repeatUnit.dispatchEvent(new Event("change"));

    var neverRadio = document.getElementById("never");
    var onDateRadio = document.getElementById("on-date");
    var afterOccurrencesRadio = document.getElementById("after-occurrences");
    var endsOn = document.querySelector(".ends-on");
    var endsAfter = document.querySelector(".ends-after");

    function updateVisibility() {
        endsOn.style.display = onDateRadio.checked ? "block" : "none";
        endsAfter.style.display = afterOccurrencesRadio.checked ? "block" : "none";
    }

    neverRadio.addEventListener("change", updateVisibility);
    onDateRadio.addEventListener("change", updateVisibility);
    afterOccurrencesRadio.addEventListener("change", updateVisibility);

    neverRadio.dispatchEvent(new Event("change"));

    dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect()
        if (
            (e.clientX !=0 && e.clientY !=0) &&
            (e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom) 
        ) {
            dialog.close()
        }
    });
}



function getSchedule() {
    let schedule = localStorage.getItem("NewscheduleCache");
    if (schedule==null)
        schedule = {nStations: 0, stations: new LinkedList()};
    else {
        schedule = JSON.parse(schedule);
        schedule.stations = new LinkedList(null, schedule.stations);
    }

    return schedule;
}


function setAddSchPriority() {
    let scheduleType = localStorage.getItem("scheduleType");

    if (scheduleType == "edit") {   
        let schedule = localStorage.getItem("NewscheduleCache");
        let otherSchedule = localStorage.getItem("otherSchedule");

        localStorage.setItem("NewscheduleCache", otherSchedule);
        localStorage.setItem("otherSchedule", schedule);
        localStorage.setItem("scheduleType", "add");
    }


}


function setEditSchPriority() {
    let scheduleType = localStorage.getItem("scheduleType");

    if (scheduleType == "add") {   
        let schedule = localStorage.getItem("NewscheduleCache");
        let otherSchedule = localStorage.getItem("otherSchedule");

        localStorage.setItem("NewscheduleCache", otherSchedule);
        localStorage.setItem("otherSchedule", schedule);
        localStorage.setItem("scheduleType", "edit");
    }
}


function saveSchedule(schedule) {
    let serializedSchedule = schedule;
    serializedSchedule.stations = schedule.stations.toArray();
    localStorage.setItem("NewscheduleCache", JSON.stringify(serializedSchedule));
}



function validateStations() {

    // Array.from(document.getElementById("schedule_stations").rows).forEach(row => row.style.border = "none")

    let schedule = getSchedule();
    let stationList = schedule.stations;

    if (stationList.head!=null) {
        let prev = stationList.head;
        let current = prev.next;

        for (let i=1; current!=null; i++) {
            let depTime = prev.data.scheduledDepartureTime.split(":").map(e => parseInt(e));
            let arrTime = current.data.scheduledArrivalTime.split(":").map(e => parseInt(e));
            let prevDeparture = new Date().setHours(depTime[0], depTime[1], 0);
            let currArrival = new Date().setHours(arrTime[0], arrTime[1]);

            let row = document.getElementById("schedule_stations").rows[i];
            if (currArrival <= prevDeparture) {
                // row.style.border = "2px solid red";
                row.classList.add("row-invalid");
            }
            else {
                // row.style.border = "none";
                // row.removeAttribute("style");
                row.classList.remove("row-invalid");
                row.classList.add("row-valid");
            }
            prev = current;
            current = prev.next;
        }

        let first_row = document.getElementById("schedule_stations").rows[0];
        first_row.classList.remove("row-invalid");
        first_row.classList.add("row-valid");
    }

}




// ########################### Table row drag & drop functionalities ##############################

function dynamicDraggableTable() {
    const table = document.getElementById('schedule-stations-table');

    let draggingEle;
    let draggingRowIndex;
    let placeholder;
    let list;
    let isDraggingStarted = false;

    // The current position of mouse relative to the dragging element
    let x = 0;
    let y = 0;

    // Swap two nodes
    const swap = function (nodeA, nodeB) {
        const parentA = nodeA.parentNode;
        const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

        // Move nodeA to before the nodeB
        nodeB.parentNode.insertBefore(nodeA, nodeB);

        // Move nodeB to before the sibling of nodeA
        parentA.insertBefore(nodeB, siblingA);
    };

    // Check if nodeA is above nodeB
    const isAbove = function (nodeA, nodeB) {
        // Get the bounding rectangle of nodes
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();

        return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
    };

    const cloneTable = function () {
        const rect = table.getBoundingClientRect();
        const width = parseInt(window.getComputedStyle(table).width);

        list = document.createElement('div');
        list.classList.add('clone-list');
        list.style.position = 'absolute';
        list.style.left = rect.left + 'px';
        list.style.top = rect.top + 'px';
        table.parentNode.insertBefore(list, table);

        // Hide the original table
        table.style.visibility = 'hidden';
        // table.style.display = "none";

        table.querySelectorAll('tr').forEach(function (row, index) {
            // Create a new table from given row
            const item = document.createElement('div');
            item.classList.add('draggable');

            const newTable = document.createElement('table');
            newTable.setAttribute('class', '.table');
            newTable.style.width = width + 'px';

            const newRow = document.createElement('tr');
            const cells = [].slice.call(row.children);
            cells.forEach(function (cell) {
                const newCell = cell.cloneNode(true);
                newCell.style.width = parseInt(window.getComputedStyle(cell).width) + 'px';
                newRow.appendChild(newCell);
            });

            if(index==0) {
                const header = document.createElement('thead');
                header.appendChild(newRow);
                newTable.appendChild(header);
            }
            else
                newTable.appendChild(newRow);

            // newTable.appendChild(newRow);
            item.appendChild(newTable);
            list.appendChild(item);
        });
    };

    const mouseDownHandler = function (e) {
        // Get the original row
        const originalRow = e.target.parentNode;
        draggingRowIndex = [].slice.call(table.querySelectorAll('tr')).indexOf(originalRow);

        // Determine the mouse position
        x = e.clientX;
        y = e.clientY;

        // Attach the listeners to document
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        if (!isDraggingStarted) {
            isDraggingStarted = true;

            cloneTable();

            draggingEle = [].slice.call(list.children)[draggingRowIndex];
            draggingEle.classList.add('dragging');

            // Let the placeholder take the height of dragging element
            // So the next element won't move up
            placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');
            draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
            placeholder.style.height = draggingEle.offsetHeight + 'px';
        }

        // Set position for dragging element
        draggingEle.style.position = 'absolute';
        draggingEle.style.top = (draggingEle.offsetTop + e.clientY - y) + 'px';
        draggingEle.style.left = (draggingEle.offsetLeft + e.clientX - x) + 'px';

        // Reassign the position of mouse
        x = e.clientX;
        y = e.clientY;

        // The current order
        // prevEle
        // draggingEle
        // placeholder
        // nextEle
        const prevEle = draggingEle.previousElementSibling;
        const nextEle = placeholder.nextElementSibling;

        // The dragging element is above the previous element
        // User moves the dragging element to the top
        // We don't allow to drop above the header
        // (which doesn't have previousElementSibling)
        if (prevEle && prevEle.previousElementSibling && isAbove(draggingEle, prevEle)) {
            // The current order    -> The new order
            // prevEle              -> placeholder
            // draggingEle          -> draggingEle
            // placeholder          -> prevEle
            swap(placeholder, draggingEle);
            swap(placeholder, prevEle);
            return;
        }

        // The dragging element is below the next element
        // User moves the dragging element to the bottom
        if (nextEle && isAbove(nextEle, draggingEle)) {
            // The current order    -> The new order
            // draggingEle          -> nextEle
            // placeholder          -> placeholder
            // nextEle              -> draggingEle
            swap(nextEle, placeholder);
            swap(nextEle, draggingEle);
        }
    };

    const mouseUpHandler = function () {
        // Remove the placeholder
        placeholder && placeholder.parentNode.removeChild(placeholder);

        draggingEle.classList.remove('dragging');
        draggingEle.style.removeProperty('top');
        draggingEle.style.removeProperty('left');
        draggingEle.style.removeProperty('position');

        // Get the end index
        const endRowIndex = [].slice.call(list.children).indexOf(draggingEle);

        let schedule = getSchedule();
        schedule.stations.move(draggingRowIndex, endRowIndex);
        saveSchedule(schedule);

        isDraggingStarted = false;

        // Remove the list element
        list.parentNode.removeChild(list);

        // Move the dragged row to endRowIndex
        let rows = [].slice.call(table.querySelectorAll('tr'));
        draggingRowIndex > endRowIndex
            ? rows[endRowIndex].parentNode.insertBefore(rows[draggingRowIndex], rows[endRowIndex])
            : rows[endRowIndex].parentNode.insertBefore(
                    rows[draggingRowIndex],
                    rows[endRowIndex].nextSibling
                );

        // Bring back the table
        table.style.removeProperty('visibility');
        // table.style.removeAttribute("display");

        // Remove the handlers of mousemove and mouseup
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        validateStations();
    };

    table.querySelectorAll('tr').forEach(function (row, index) {
        // Ignore the header
        // We don't want user to change the order of header
        if (index === 0) {
            return;
        }

        const firstCell = row.firstElementChild;
        firstCell.classList.add('draggable');
        firstCell.addEventListener('mousedown', mouseDownHandler);
    });
}


