
const url = "http://localhost:8080/railboost_backend_war_exploded/train";


createTrainsPage();


function createTrainsPage() {
    const count = 5;

    fetch(url+"?" + new URLSearchParams({
        count: 5
    }))
    .then(resp => resp.json())
    .then(trains => createHtmlTable(trains))
}


function createHtmlTable(trains) {
    const parent = document.getElementById("train_table");

    trains.forEach(train => {
        let row = createRow(train);
        parent.appendChild(row);
    });

}



function createRow(train) {
    // Create the <tr> element
    var tableRow = document.createElement('tr');

    // Create and append <td> elements
    var td1 = document.createElement('td');
    td1.textContent = train["trainId"];
    tableRow.appendChild(td1);

    var td2 = document.createElement('td');
    td2.textContent = train["trainType"];
    tableRow.appendChild(td2);

    var td3 = document.createElement('td');
    td3.textContent = train["nCompartments"];
    tableRow.appendChild(td3);

    var td4 = document.createElement('td');

    // Create the anchor and button for "Edit"
    // var anchor1 = document.createElement('a');
    // anchor1.setAttribute('href', ''); // Add your URL
    var editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.onclick = editTrain;
    editButton.setAttribute("train", JSON.stringify(train));
    var editIcon = document.createElement('i');
    editIcon.className = 'fas fa-edit';
    editButton.appendChild(editIcon);
    // anchor1.appendChild(editButton);

    // Create the anchor and button for "Delete"
    // var anchor2 = document.createElement('a');
    // anchor2.setAttribute('href', ''); // Add your URL
    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.onclick = deleteTrain;
    deleteButton.setAttribute("train", JSON.stringify(train));
    var deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash';
    deleteButton.appendChild(deleteIcon);
    // anchor2.appendChild(deleteButton);

    // Append the "Edit" and "Delete" buttons to the <td>
    td4.appendChild(editButton);
    td4.appendChild(deleteButton);

    // Append all <td> elements to the <tr> element
    tableRow.appendChild(td1);
    tableRow.appendChild(td2);
    tableRow.appendChild(td3);
    tableRow.appendChild(td4);

    return tableRow;
}



function editTrain() {
    train = JSON.parse(this.getAttribute("train"));
    console.log(train);

    const button = document.getElementById("add-new-train-button");

    document.getElementById("add-new-train-header").innerHTML = "Update Train";
    button.innerHTML = "Update";

    let trainIdField = document.getElementById("trainId");
    trainIdField.value = train["trainId"]
    trainIdField.disabled = true;

    document.getElementById("trainType").value = train["trainType"];
    document.getElementById("nCompartments").value = train["nCompartments"];

    button.setAttribute("train", JSON.stringify(train));
    button.onclick = updateTrain;
}



function deleteTrain() {
    train = JSON.parse(this.getAttribute("train"));
    console.log(train);

    let confirm = window.confirm ("Are you sure you want to delete train with id " +train["trainId"]);
    if (confirm) {
        const body = train;
        const params = {
            headers : {
                "Content-type": "application/json; charset=UTF-8"
            },
            body : JSON.stringify(body),
            method : "DELETE",
            credentials : "include"
        };

        fetch(url, params)
        .then(res => {
            if(res.ok) {
                window.location.reload();
            }
        });
    }
}



function addNewTrain() {
    train = {};

    train["trainId"] = document.getElementById("trainId").value;
    train["trainType"] = document.getElementById("trainType").value;
    train["nCompartments"] = document.getElementById("nCompartments").value;

    const body = train;
    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(body),
        method : "POST",
        credentials : "include"
    };

    fetch(url, params)
    .then(res => {
        if(res.ok) {
            window.location.reload();
        }
    });

    console.log(train);
}



function updateTrain() {
    train = {};

    train["trainId"] = document.getElementById("trainId").value;
    train["trainType"] = document.getElementById("trainType").value;
    train["nCompartments"] = document.getElementById("nCompartments").value;

    const body = train;
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

    console.log(train);
}

function validateCompartments() {
    var compartmentsField = document.getElementById("nCompartments");
    var compartmentsError = document.getElementById("compartments-error");
    var compartmentsValue = parseInt(compartmentsField.value, 10); // Parse as an integer
  
    if (isNaN(compartmentsValue) || compartmentsValue < 0 || compartmentsValue > 100) {
      compartmentsError.innerHTML = "Please enter a valid number of compartments (0-100).";
      return false;
    }
  
    // Clear any previous error message
    compartmentsError.innerHTML = "";
  
    return true;
  }
  

