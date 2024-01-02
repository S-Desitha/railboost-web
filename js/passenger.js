const url = "http://localhost:8080/railboost_backend_war_exploded/trainSchedule";

let queryParams = new URLSearchParams(window.location.search);
let schParams = JSON.parse(queryParams.get("schedule"));


document.addEventListener("DOMContentLoaded", getSchedules());


function getSchedules() {
    console.log(schParams);

    let urlQuery = url+`?json=${encodeURIComponent(JSON.stringify(schParams))}`;
    fetch(urlQuery, {credentials : "include"})
        .then(resp => {
            if (resp.ok)
                resp.json().then(schedules => {
                    schedules.forEach(sch => {
                        let viewButton = document.createElement("button");
                        viewButton.classList.add("view-button");
                        viewButton.innerHTML = "View <i class='fa-regular fa-eye'>";
                        viewButton.onclick = function() {window.location.href = `/html/passenger/traintimes.html?scheduleId=${sch.scheduleId}`};

                        let row = document.getElementById("schedule_table").insertRow(-1);
                        row.insertCell(0).innerHTML = sch.scheduleId;
                        row.insertCell(1).innerHTML = sch.trainId;
                        row.insertCell(2).innerHTML = sch.startStation;
                        row.insertCell(3).innerHTML = sch.endStation;
                        row.insertCell(4).innerHTML = sch.trainType;
                        row.insertCell(5).appendChild(viewButton);
                    });
                });
        });
}