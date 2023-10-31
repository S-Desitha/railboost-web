const url = "http://localhost:8080/railboost_backend_war_exploded/trainSchedule";

function getSchedule() {
    const scheduleId = 2;
    let urlQuery = url+"?scheduleId="+scheduleId;

    fetch(urlQuery, {credentials:"include"})
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
    td5.textContent = schedule["trainType"];
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
    var anchor2 = document.createElement('a');
    anchor2.setAttribute('href', ''); // Add your URL
    var editButton = document.createElement('button');
    editButton.className = 'edit-button';
    var editIcon = document.createElement('i');
    editIcon.className = 'fas fa-edit';
    editButton.appendChild(editIcon);
    anchor2.appendChild(editButton);

    // Create the anchor and button for "Delete"
    var anchor3 = document.createElement('a');
    anchor3.setAttribute('href', ''); // Add your URL
    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    var deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash';
    deleteButton.appendChild(deleteIcon);
    anchor3.appendChild(deleteButton);

    // Append the "Edit" and "Delete" buttons to the <td>
    td7.appendChild(anchor2);
    td7.appendChild(anchor3);

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

    window.location.href = url+"?schedule="+encodeURIComponent(schedule);
}



getSchedule();