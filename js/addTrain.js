const addTrainsEndPoint = "addParcelsToTrain";
const addedParcelsArray= [];

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
            const tableContainer = document.querySelector('.table_body');
        const addDeliveryStatusButton = document.getElementById('addDileveryStatus');
        
        tableContainer.style.display = 'block';
        addDeliveryStatusButton.style.display = 'block';
            let addButten = document.createElement("button");
           
            addButten.classList.add("set-station-button");
            addButten.innerHTML = "<i title='addParcel' style='color:#0047AB; font-weight: bold;'><span> Select </span></i>";
            addButten.setAttribute("addedParcel", JSON.stringify(sch));
            addButten.onclick = addParcelSet;

            let row = document.getElementById("addParcels").insertRow(-1);
            row.insertCell(0).innerHTML = sch.bookingId;
            row.insertCell(1).innerHTML = sch.item;
            row.insertCell(2).append(addButten);   
    
        });
    }catch{

    }

}

async function addParcelSet(){
    var addedParcel = JSON.parse(this.getAttribute("addedParcel"));

    addedParcelsArray.push(addedParcel.bookingId);
    // addedParcelsArray.push(scheduleId);
    // const newArray = newArray.concat(addedParcelsArray);
    // let newArray = [].concat(Array, addedParcel)
    console.log(addedParcelsArray);


    // const body = addedParcelsArray;
    // const params = {
    //     scheduleId: scheduleId,
    //     headers: {
    //     "Content-type": "application/json; charset=UTF-8"
    //     },
    //     body: JSON.stringify(body),
    //     method: "PUT"
    // };
    // customFetch(addTrainsEndPoint, params)
    //     .then(()=> window.location.reload())
    //     .catch((error) => {
    //         if (error=="login-redirected")
    //             localStorage.setItem("last_url", window.location.pathname);
    //     });
    var SelectButtons = document.querySelectorAll(".set-station-button");
    this.innerHTML = "<i title='addParcel' style='color:#0047AB; font-weight: bold;'><span> Selected </span></i>";
    this.style.backgroundColor = "#AED6F1";


}

async function addDileveryStatus(){

    Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5271FF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Send!",
    }).then((result) => {
        if (result.isConfirmed) {
            var scheduleId = document.getElementById("scheduleDropDown").value;
                const body = {bookingIdList:addedParcelsArray,
                    scheduleId : scheduleId
                    };
                const params = {
                sid: scheduleId,
                headers: {
                "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(body),
                method: "PUT"
            };
            customFetch(addTrainsEndPoint, params)
                .then(()=> window.location.reload())
                .catch((error) => {
                    if (error=="login-redirected")
                        localStorage.setItem("last_url", window.location.pathname);
                });
        } else {
            Swal.fire("Cancelled", "Your operation has been cancelled", "error");
            
        }
    });


}



