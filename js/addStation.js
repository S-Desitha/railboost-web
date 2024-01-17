const url = "http://localhost:8080/railboost_backend_war_exploded/staff";

        // Get the select element
        var selectOption = document.getElementById("selectOption");

        // Get the elements to be displayed
        var option1Elements = document.getElementById("option1Elements");

        // Add an event listener to the select element
        selectOption.addEventListener("change", function() {
            // Hide the element first
            option1Elements.classList.add("hidden");

            // Show the element if the selected option is "option1"
            if (selectOption.value === "option1") {
                option1Elements.classList.remove("hidden");
            }
        });



document.addEventListener("DOMContentLoaded",function(){
    document.getElementById("station_form").reset();

    fetch(url,{credentials : "include"})
        .then(res => {
            if(res.ok) {
                return res.json();   
            }
        })



.then(stations =>{
    stations.forEach(element => {
        let editButton = document.createElement("button");
                editButton.classList.add("edit-button");
                editButton.innerHTML = "<i class='fas fa-edit'></i>";
                editButton.setAttribute("staffMember", JSON.stringify(staffMember));
                editButton.onclick = editStaff;

                let deleteButton = document.createElement("button");
                deleteButton.classList.add("delete-button");
                deleteButton.innerHTML = "<i class='fas fa-trash-alt'></i>";

                let row = document.getElementById("stations_table").insertRow(-1);
                row.insertCell(0).innerHTML = element.stationId;
                row.insertCell(1).innerHTML = element.stationName;
                row.insertCell(2).innerHTML = element.address;
                row.insertCell(3).innerHTML = element.line;
                row.insertCell(4).innerHTML = element.contactNum;
                row.insertCell(5).append(editButton , deleteButton);
        
        });
    });

})


function updateStation() {
    element = {station: {}}

    element["stationId"] = document.getElementById('stationId').value;
    element["stationName"] = document.getElementById('stationName').value;
    element["address"] = document.getElementById('address').value;
    element["stationName"] = document.getElementById('stationName').value;
    element["stationName"] = document.getElementById('stationName').value;
}