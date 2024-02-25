// const url = "http://localhost:8080/railboost_backend_war_exploded/trainSchedule";
const scheduleEndpoint = "trainSchedule";

document.addEventListener("DOMContentLoaded", async function() {

    if (window.location.pathname.includes("schedule.html"))
        createSchedulesPage();
    else if (window.location.pathname.includes("trainSch.html"))
        createSpecificSchPage();
    
    document.getElementById("from").addEventListener("click", function() {
        console.log("start station");
    })

    dynamicDraggableTable();
});




function addStoppingStation() {
    let schedule = getSchedule();
    // let schedule = localStorage.getItem("schedule");
    // if (schedule==null)
    //     schedule = {nStations: 0, stations: new LinkedList()};
    // else {
    //     schedule = JSON.parse(schedule);
    //     schedule.stations = new LinkedList(null, schedule.stations);
    // }
    // schedule = schedule==null ? {nStations: 0, stations: new LinkedList()} : JSON.parse(schedule);

    let button = document.getElementById("add_update-sch_station");
    
    station = {
        "scheduleId" : document.getElementById("sch-id").value,
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
        // station.stIndex = schedule.nStations;
        schedule.stations.push(new Node(station));
        insertStationToPage(station);
        schedule.nStations++;
    }

    document.getElementById("station-form").reset();


    // let serializedSchedule = schedule;
    // serializedSchedule.stations = schedule.stations.toArray();
    // localStorage.setItem("schedule", JSON.stringify(serializedSchedule));
    saveSchedule(schedule);
    dynamicDraggableTable();
}




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
    deleteButton.onclick = deleteStation;

    row.insertCell(0).innerHTML = station.stationName;
    row.insertCell(1).innerHTML = station.scheduledArrivalTime;
    row.insertCell(2).innerHTML = station.scheduledDepartureTime;
    row.insertCell(3).append(editButton, deleteButton);
}




function editStation() {
    this.closest("tr").setAttribute("tag", "edit");
    
    let stationCode = this.closest("tr").getAttribute("stationCode");
    let schedule = getSchedule();

    schedule.stations.tagNode(stationCode, "edit");
    saveSchedule(schedule);

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

    popupAddPage('.add-station-modal')
}



function deleteStation() {
    let stationCode = this.closest("tr").getAttribute("stationCode");
    let schedule = getSchedule();

    schedule.stations.removeNode('station', stationCode);
    saveSchedule(schedule);

    this.closest("tr").remove();
    dynamicDraggableTable();
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


function getSchedule() {
    let schedule = localStorage.getItem("schedule");
    if (schedule==null)
        schedule = {nStations: 0, stations: new LinkedList()};
    else {
        schedule = JSON.parse(schedule);
        schedule.stations = new LinkedList(null, schedule.stations);
    }

    return schedule;
}


function saveSchedule(schedule) {
    let serializedSchedule = schedule;
    serializedSchedule.stations = schedule.stations.toArray();
    localStorage.setItem("schedule", JSON.stringify(serializedSchedule));
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
                // newTable.appendChild(document.createElement('thead').appendChild(newRow));
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

        // Remove the handlers of mousemove and mouseup
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
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


