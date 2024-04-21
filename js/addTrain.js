const addTrainsEndPoint = "addParcelsToTrain";

document.addEventListener("DOMContentLoaded", async function () {
     getSchedule();
    
});
async function getSchedule() {
    try {
        let qparams = {
            scheduleId: "hello"
        };
        
        let queryString = Object.keys(qparams).map(key => key + '=' + encodeURIComponent(qparams[key])).join('&');
        let urlQuery = `${addTrainsEndPoint}?${queryString}`;
        const data = await customFetch(urlQuery, {});
        console.log(data);

        const select = document.getElementById('scheduleDropDown');
        data.forEach(schedule => {
            const opt = document.createElement('option');
            opt.value = schedule.scheduleId;
            opt.innerHTML = schedule.scheduleId;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error('Error fetching schedule:', error);
    }
}

async function searchParcels(){
    addParcelendPoint = "addParcelsToTrain";
    var scheduleId = document.getElementById("scheduleDropDown").value;
    console.log(scheduleId)




    let qparams = {
        scheduleId: scheduleId
    };
    
    let queryString = Object.keys(qparams).map(key => key + '=' + encodeURIComponent(qparams[key])).join('&');
    let urlQuery = `${addParcelendPoint}?${queryString}`;

    try{
        const data = await customFetch(urlQuery, {});
        data.forEach(sch => {
            let addButten = document.createElement("button");
           
            addButten.classList.add("set-station-button");
            addButten.innerHTML = "<i title='addParcel' ><span> Add To Schedule</span></i>";
            addButten.setAttribute("parcelSchedule", JSON.stringify(sch));
            addButten.onclick = setSchedule;

            let row = document.getElementById("addParcels").insertRow(-1);
            row.insertCell(0).innerHTML = sch.bookingId;
            row.insertCell(1).append(addButten);   
    
        });
    }catch{

    }

}



