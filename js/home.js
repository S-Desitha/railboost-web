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
        document.getElementById("startStationName").textContent = data.homeStation;
    //    display the schedule
    console.log(schParams);

    let urlQuery2 = endpoint + `?json=${encodeURIComponent(JSON.stringify(schParams))}`;

    
    try {
        let schedules = await customFetch(urlQuery2, {}, false);
        console.log(schedules);
    
        const currentTime = new Date();
        const midnightTime = new Date();
        midnightTime.setHours(23, 59, 59, 999);
    
        schedules = schedules.filter(schedule => {
            const startStationInfo = getStationInfo(schedule.stations, schParams.startStation);
            const scheduledArrivalTime = startStationInfo[0].scheduledArrivalTime;
            const arrivalTime = getTimeInMilliseconds(scheduledArrivalTime);
    
            return arrivalTime > currentTime.getTime() && arrivalTime < midnightTime.getTime();
        });
    
        schedules.sort((a, b) => {
            const timeA = getTimeInMilliseconds(getStationInfo(a.stations, schParams.startStation)[0].scheduledArrivalTime);
            const timeB = getTimeInMilliseconds(getStationInfo(b.stations, schParams.startStation)[0].scheduledArrivalTime);
            return timeA - timeB;
        });
    
        schedules.forEach(schedule => {



            // let infoButton = document.createElement("button");
            // infoButton.classList.add("edit-button");
            // infoButton.classList.add("data-open-modal");
            // infoButton.innerHTML = "<i class='fa-solid fa-circle-info'></i>";
            // infoButton.setAttribute("stations", JSON.stringify(schedule.stations));

            // infoButton.onclick = function(){ getSchedule(schedule.scheduleId,schParams.date);}
            const startStationInfo = getStationInfo(schedule.stations, schParams.startStation);
            let row = document.getElementById("recent_sch__table").insertRow(-1);
            row.insertCell(0).innerHTML = schedule.endStationName;
            row.insertCell(1).innerHTML = schedule.speed;
            row.insertCell(2).innerHTML = startStationInfo[0].scheduledArrivalTime;
            row.insertCell(3).innerHTML = getStationInfo(schedule.stations, schParams.endStation)[0].scheduledArrivalTime;
            
        });
    } catch (error) {
        if (error == "login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }
    
    function getTimeInMilliseconds(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return new Date().setHours(hours, minutes, 0, 0);
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