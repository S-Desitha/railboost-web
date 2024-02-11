const url = "http://localhost:8080/railboost_backend_war_exploded/trainSchedule";




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






function getSchedule() {
    const scheduleId = 3;
    let urlQuery = url+"?scheduleId="+scheduleId;

    fetch(urlQuery, {})
        .then(raw => raw.json())
        .then(response => createHTML(response))
}

function createHTML(schedule) {
    console.log(schedule)
    const parent = document.getElementById("schedule_table");

    let row = createRow(schedule);
    parent.append(row);
}


function createRow(schedule) {
    // Create the <tr> element
    var tableRow = document.createElement('tr');

    // Create and append <td> elements
    var td1 = document.createElement('td');
    td1.textContent = schedule["scheduleId"];
    tableRow.appendChild(td1);

    var td2 = document.createElement('td');
    td2.textContent = schedule["trainId"];
    tableRow.appendChild(td2);

    var td3 = document.createElement('td');
    td3.textContent = schedule["startStation"];
    tableRow.appendChild(td3);

    var td4 = document.createElement('td');
    td4.textContent = schedule["endStation"]
    tableRow.appendChild(td4);

    var td5 = document.createElement('td');
    td5.textContent = schedule["speed"];
    tableRow.appendChild(td5);

    var td6 = document.createElement('td');

    // Create the anchor (<a>) element
    // var anchor1 = document.createElement('a');
    // anchor1.setAttribute('href', 'trainSch.html');
    var button1 = document.createElement('button');
    button1.className = 'view-button';
    button1.setAttribute("schedule", JSON.stringify(schedule));
    button1.onclick = viewStations;
    var icon1 = document.createElement('i');
    icon1.className = 'fa-regular fa-eye';
    button1.appendChild(icon1);
    button1.appendChild(document.createTextNode(' View '));
    // anchor1.appendChild(button1);
    // td6.appendChild(anchor1);
    td6.appendChild(button1);

    var td7 = document.createElement('td');

    // Create the anchor and button for "Edit"
    // var anchor2 = document.createElement('a');
    // anchor2.setAttribute('href', ''); // Add your URL
    var editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.onclick = editSchedule;
    editButton.setAttribute("schedule", JSON.stringify(schedule));
    var editIcon = document.createElement('i');
    editIcon.className = 'fas fa-edit';
    editButton.appendChild(editIcon);
    // anchor2.appendChild(editButton);

    // Create the anchor and button for "Delete"
    var anchor3 = document.createElement('a');
    anchor3.setAttribute('href', ''); // Add your URL
    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.onclick = deleteSchedule;
    deleteButton.setAttribute("schedule", JSON.stringify(schedule));
    var deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash';
    deleteButton.appendChild(deleteIcon);
    anchor3.appendChild(deleteButton);

    // Append the "Edit" and "Delete" buttons to the <td>
    // td7.appendChild(anchor2);
    // td7.appendChild(anchor3);
    td7.appendChild(editButton);
    td7.appendChild(deleteButton);

    // Append all <td> elements to the <tr> element
    tableRow.appendChild(td1);
    tableRow.appendChild(td2);
    tableRow.appendChild(td3);
    tableRow.appendChild(td4);
    tableRow.appendChild(td5);
    tableRow.appendChild(td6);
    tableRow.appendChild(td7);

    return tableRow;
}



function viewStations() {
    const url = "trainSch.html";
    const schedule = this.getAttribute("schedule");
    // const schedule = JSON.parse(this.getAttribute("schedule"));

    window.location.href = url+"?addNew=false&schedule="+encodeURIComponent(schedule);
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



function addNewSchedule() {
    console.log("Add new train schedule");
    schedule = {
        stations: []
    };
    schedule["scheduleId"] = document.getElementById("scheduleId").value;
    schedule["trainId"] = document.getElementById("trainId").value;
    schedule["startStation"] = document.getElementById("start-station").value;
    schedule["endStation"] = document.getElementById("end-station").value;

    window.location.href = "trainSch.html?addNew=true&schedule="+encodeURIComponent(JSON.stringify(schedule));

    // console.log(schedule);

    // const body = schedule;
    // const params = {
    //     headers : {
    //         "Content-type": "application/json; charset=UTF-8"
    //     },
    //     body : JSON.stringify(body),
    //     method : "POST",
    //     credentials : "include"
    // };

    // fetch(url, params)
    // .then(res => {
    //     if(res.ok) {
    //         window.location.reload();
    //     }
    // });
}



// getSchedule();