
let queryParams = new URLSearchParams(window.location.search);
const schedule = JSON.parse(queryParams.get("schedule"));
const addNew = queryParams.delete("addNew");
var s_i = 0;
console.log(schedule);
console.log(addNew)


if (addNew==false){
    createPage(); 
}


function createPage() {
    console.log(schedule);

    createTitle(schedule);
    createTable(schedule);
}



function createTitle(schedule) {
    let parent = document.getElementById("scheduleTitle");
    let icon = document.createElement("i");
    icon.className = "fas fa-train";
    parent.appendChild(icon);

    let header = document.createElement("h3");
    let headerTxt = document.createTextNode(schedule["startStation"] + " - "+ schedule["endStation"]);
    header.appendChild(headerTxt);
    parent.appendChild(header);

    let trainNo = document.createElement("p");
    let trainNoTxt = document.createTextNode("Train Number: " +schedule["trainId"]);
    trainNo.appendChild(trainNoTxt);
    parent.appendChild(trainNo);

    let type = document.createElement("p");
    let typeTxt = document.createTextNode("Train Type: " +schedule["trainType"]);
    type.appendChild(typeTxt);
    parent.appendChild(type);

}




function createTable(schedule) {
    const parent = document.getElementById("schedule_stations");
    
    for (let i=0; i<2; i++){
        let station = schedule["stations"][i];
        let row = createRow(station);
        parent.append(row);
    }
}



function createRow(station) {
    // console.log(station);
        // Create the <tr> element
        var tableRow = document.createElement('tr');

        // Create and append <td> elements
        var td1 = document.createElement('td');
        td1.textContent = station["station"];
        tableRow.appendChild(td1);

        var td2 = document.createElement('td');
        td2.textContent = station["scheduledArrivalTime"];
        tableRow.appendChild(td2);

        var td3 = document.createElement('td');
        td3.textContent = station["scheduledDepartureTime"]
        tableRow.appendChild(td3);

        var td4 = document.createElement('td');

        // Create the anchor and button for "Edit"
        // var anchor1 = document.createElement('a');
        // anchor1.setAttribute('href', ''); // Add your URL
        var editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.setAttribute("station", JSON.stringify(station));
        editButton.onclick = editStation;
        var editIcon = document.createElement('i');
        editIcon.className = 'fas fa-edit';
        editButton.appendChild(editIcon);
        // anchor1.appendChild(editButton);

        // Create the anchor and button for "Delete"
        // var anchor2 = document.createElement('a');
        // anchor2.setAttribute('href', ''); // Add your URL
        var deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.setAttribute("station", JSON.stringify(station));
        deleteButton.onclick = deleteStation;
        var deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash';
        deleteButton.appendChild(deleteIcon);
        // anchor2.appendChild(deleteButton);

        // Append the "Edit" and "Delete" buttons to the <td>
        // td4.appendChild(anchor1);
        // td4.appendChild(anchor2);
        td4.appendChild(editButton);
        td4.appendChild(deleteButton)

        // Append all <td> elements to the <tr> element
        tableRow.appendChild(td1);
        tableRow.appendChild(td2);
        tableRow.appendChild(td3);
        tableRow.appendChild(td4);

        // Now, you can append the <tr> element to your document or any other desired location
        return tableRow;
}



function editStation() {
    console.log("Edit station button clicked");
}



function deleteStation() {
    console.log("Delete button clicked");
    let station = JSON.parse(this.getAttribute("station"));
    // console.log(station);

    let updatedSch = Object.assign({}, schedule);

    updatedSch["stations"].forEach((item, index, obj) => {
        if(item["station"]==station["station"]) {
            updatedSch["stations"].splice(index, 1);
        }
    });

    console.log(schedule);
    console.log(updatedSch);
}




function addSchStation(){
    schedule["stations"].push({
        scheduleId : schedule["scheduleId"],
        station : document.getElementById("sch-station").value,
        stIndex: s_i,
        scheduledArrivalTime: document.getElementById("Scheduled Arrival Time").value,
        scheduledDepartureTime: document.getElementById("Scheduled Departure Time").value
    });

    console.log(schedule);
}

