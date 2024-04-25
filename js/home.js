const endpoint2 = "profile"

document.addEventListener("DOMContentLoaded", async function () {
    // const endpoint3 = "user"
    let params = {
        view: 1,
        userId: localStorage.getItem("userId"),
    };
    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${endpoint2}?${queryString}`;
    
        let data = await customFetch(urlQuery, {credentials: "include"});
        console.log(data);
        document.querySelector('.homeStation p').textContent=data.homeStation;
        console.log(data.homeStation);

        const endpoint = "trainSchedule";
        let schParams = {
            startStation: data.homeStCode,
            endStation:"FOT",
            date:new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        };
    //    display the schedule
    console.log(schParams);

    let urlQuery2 = endpoint + `?json=${encodeURIComponent(JSON.stringify(schParams))}`;

    
    try{
        let schedules = await customFetch(urlQuery2, {}, false);
        console.log(schedules);
    
    
        schedules.forEach(schedule => {
            // let editButton = document.createElement("button");
            // editButton.classList.add("edit-button");
            // editButton.innerHTML = "<i class='fas fa-edit'></i>";
            // editButton.setAttribute("staffMember", JSON.stringify(staffMember));
            // editButton.onclick = editStaff;
    
            // let deleteButton = document.createElement("button");
            // deleteButton.classList.add("delete-button");
            // deleteButton.innerHTML = "<i class='fas fa-trash-alt'></i>";
            // deleteButton.setAttribute("staffMember", JSON.stringify(staffMember));
            // deleteButton.onclick = deleteStaff;
    
            let row = document.getElementById("recent_sch__table").insertRow(-1);
            row.insertCell(0).innerHTML = schedule.endStationName;
            row.insertCell(1).innerHTML = schedule.speed;
            const startStationInfo = getStationInfo(schedule.stations, schParams.startStation);
            const endStationInfo = getStationInfo(schedule.stations, schParams.endStation);
            row.insertCell(2).innerHTML = startStationInfo[0].scheduledArrivalTime;
            row.insertCell(3).innerHTML = endStationInfo[0].scheduledArrivalTime;
            // row.insertCell(1).innerHTML = staffMember.user.fName + " " + staffMember.user.lName;
            // // row.insertCell(2).innerHTML = staffMember.user.username;
            // row.insertCell(2).innerHTML = staffMember.user.email;
            // row.insertCell(3).innerHTML = staffMember.user.telNo;
            // let roleCell = row.insertCell(4);
            // roleCell.innerHTML = staffMember.user.role.role;
            // roleCell.setAttribute("roleId", staffMember.user.role.roleId);
            // row.insertCell(5).innerHTML = staffMember.stationName;
            // row.insertCell(6).append(editButton, deleteButton);
    
        });
    } catch(error) {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }

    
  });

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