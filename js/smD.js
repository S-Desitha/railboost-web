const endpoint2 = "profile"

document.addEventListener("DOMContentLoaded", async function () {
    createJourneys();
    getSMStation();
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
});




async function createJourneys() {
    const endpoint = "journey";
    let param = {
        date: new Date().toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"})
    }
    // Get the journeys from the backend
    let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(param))}`;

    try {
        let data = await customFetch(urlQuery, {});
        
        console.log(data);
        // Create a table row for each journey
        if (Object.keys(data)){
            data.forEach(journey => {
                let row = document.getElementById("trainLive_table").insertRow(-1);
                row.insertCell(0).innerHTML = journey.scheduleId;
                row.insertCell(1).innerHTML = journey.schedule.trainId;
                row.insertCell(2).innerHTML = journey.schedule.startStationName;
                row.insertCell(3).innerHTML = journey.schedule.endStationName;
            });
        }           
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
}