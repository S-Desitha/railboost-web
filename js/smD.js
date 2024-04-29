const endpoint2 = "profile"



document.addEventListener("DOMContentLoaded", async function () {
    getSMStation();
    createJourneys();
    
    // const endpoint3 = "user"
    let params = {
        view: 1,
        userId: localStorage.getItem("userId"),
    };
    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${endpoint2}?${queryString}`;
    
        let data = await customFetch(urlQuery, {credentials: "include"});
        console.log(data);
        // document.querySelector('.homeStation p').textContent=data.homeStation;
        // add data.role.roleId to the local storage
        localStorage.setItem("roleId", data.role.roleId);
        console.log(data.homeStation);
});




async function createJourneys() {
    const endpoint = "journey";
    let param = {
        date: new Date().toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"})
    }
    // Get the journeys from the backend
    let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(param))}`;

    try {
        let journeys = await customFetch(urlQuery, {});
        
        console.log(journeys);
        // Create a table row for each journey
        if (Object.keys(journeys)){


            const currentTime = new Date();
            const midnightTime = new Date();
            midnightTime.setHours(23, 59, 59, 999);
            journeys = journeys.filter(journey => {
                console.log(journey.stations);
                const startStationInfo = getStationInfo(journey.stations, localStorage.getItem("SmStation") );
                console.log(startStationInfo);
                const scheduledArrivalTime = startStationInfo[0].scheduledArrivalTime;
                console.log(scheduledArrivalTime);
                const arrivalTime = getTimeInMilliseconds(scheduledArrivalTime);

                return arrivalTime > currentTime.getTime() && arrivalTime < midnightTime.getTime();
            });
            journeys.sort((a, b) => {
                const timeA = getTimeInMilliseconds(getStationInfo(a.stations, localStorage.getItem("SmStation"))[0].scheduledArrivalTime);
                const timeB = getTimeInMilliseconds(getStationInfo(b.stations, localStorage.getItem("SmStation"))[0].scheduledArrivalTime);
                return timeA - timeB;
            });
            console.log(journeys);

            journeys.slice(0, 5).forEach(journey => {
                const startStationInfo = getStationInfo(journey.stations, localStorage.getItem("SmStation"));
                let row = document.getElementById("trainLive_table").insertRow(-1);
                row.insertCell(0).innerHTML = journey.scheduleId;
                row.insertCell(1).innerHTML = startStationInfo[0].scheduledArrivalTime;
                row.insertCell(2).innerHTML = journey.schedule.startStationName;
                row.insertCell(3).innerHTML = journey.schedule.endStationName;
                // row.insertCell(3).innerHTML = getStationInfo(schedule.stations, schParams.endStation)[0].scheduledArrivalTime;
            });
            console.log(journeys);

            // data.forEach(journey => {
            //     let row = document.getElementById("trainLive_table").insertRow(-1);
            //     row.insertCell(0).innerHTML = journey.scheduleId;
            //     row.insertCell(1).innerHTML = journey.schedule.trainId;
                
            // });
        }  
        
        

           
           

        //     // Display only the first 5 schedules
           





    } catch(error) {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }
}

async function getSMStation(){
    const endpoint3="staff";

    let params = {
        view: 1,
    };
    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${endpoint3}?${queryString}`;
    
        let data = await customFetch(urlQuery, {credentials: "include"});
        console.log(data);
        document.querySelector('.hisstation p').textContent="  "+data.stationName;
        console.log(data.stationName);
        // store the station name in the local storage
        localStorage.setItem("SmStation", data.stationName);
}


function getStationInfo(array, selectedStation) {
    const stationInfo = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i].stationName === selectedStation) {
            stationInfo.push({
                stationName: array[i].stationName,
                scheduledArrivalTime: array[i].scheduledArrivalTime
            });
        }
    }
    return stationInfo.length > 0 ? stationInfo : null; // Return the array of station info or null if station is not found
}
function getTimeInMilliseconds(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date().setHours(hours, minutes, 0, 0);
}
