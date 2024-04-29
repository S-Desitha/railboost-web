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
        // add data.role.roleId to the local storage
        localStorage.setItem("roleId", data.role.roleId);
        console.log(data.homeStation);

        const endpoint = "trainSchedule";
        let schParams = {
            startStation: data.homeStCode,
            endStation: "FOT",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        };
        document.getElementById("startStationName").textContent = data.homeStation;
        // Display the schedule
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
            console.log(schedules);

            // Display only the first 5 schedules
            schedules.slice(0, 5).forEach(schedule => {
                const startStationInfo = getStationInfo(schedule.stations, schParams.startStation);
                let row = document.getElementById("recent_sch__table").insertRow(-1);
                row.insertCell(0).innerHTML = schedule.endStationName;
                row.insertCell(1).innerHTML = schedule.speed;
                row.insertCell(2).innerHTML = startStationInfo[0].scheduledArrivalTime;
                row.insertCell(3).innerHTML = getStationInfo(schedule.stations, schParams.endStation)[0].scheduledArrivalTime;
            });
            console.log(schedules);
        } catch (error) {
            if (error == "login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        }

    

    const endpoint4 = "announcement"
    let params2 = {
        view: "1",
    };
    let queryString2 = Object.keys(params2).map(key => key + '=' + encodeURIComponent(params2[key])).join('&');
    let urlQuery3 = `${endpoint4}?${queryString2}`;
    
    let annsBar = document.querySelector(".anns-bar");

let data2 = await customFetch(urlQuery3, { credentials: "include" });
console.log(data2);

let sortedData = data2.filter(item => item.recivers === "All").sort((a, b) => a.id - b.id).slice(0, 3);

sortedData.forEach(item => {
    // Create elements
    let annsContainer = document.createElement("div");
    annsContainer.classList.add("anns");

    let titleElement = document.createElement("h3");
    titleElement.textContent = item.title;

    let annBody = document.createElement("div");
    annBody.classList.add("ann-body");
    let bodyParagraph = document.createElement("p");
    bodyParagraph.textContent = item.body;
    annBody.appendChild(bodyParagraph);

    let durationElement = document.createElement("div");
    durationElement.classList.add("duration");
    durationElement.textContent = "12 hours ago";

    // Append elements to container
    annsContainer.appendChild(titleElement);
    annsContainer.appendChild(annBody);
    annsContainer.appendChild(durationElement);

    // Append container to annsBar
    annsBar.appendChild(annsContainer);
});

    
        
        // data.forEach(announcement=> {
        //     if (data.length === 0) {
        //         document.querySelector(".empty_msg").style.display = "block";
        //         return;
        //     }else{
        //         document.querySelector(".empty_msg").style.display = "none";
        //         const container = document.getElementById("table-container");
    
        //         const div = document.createElement("div");
        //         div.classList.add("announcement");

        //         const title = document.createElement("h3");
        //         title.textContent = announcement.title;

        //         const date = document.createElement("h5");
        //         date.textContent = announcement.date;
        //         date.style.textAlign = "right";
        //         date.style.fontWeight = "100";

        //         const body = document.createElement("p");
        //         body.textContent = announcement.body;

        //         div.appendChild(title);
        //         div.appendChild(date);
        //         div.appendChild(body);

        //         container.appendChild(div);
        //     }
        // });
  
    
    
});

    function getTimeInMilliseconds(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return new Date().setHours(hours, minutes, 0, 0);
    }
    
    

    
  

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
