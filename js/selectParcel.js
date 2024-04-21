const selectParcelString = localStorage.getItem("stationParcels1234");
const selectParcel = JSON.parse(selectParcelString)
const stationsForSchecdul =[];
var scheduleId = 0;
console.log(selectParcel);
let urlParams = new URLSearchParams(window.location.search);
let station = urlParams.get("recoveringStation");

    try{       
        selectParcel.forEach(parcel => {
            if(parcel.recoveringStation==station){
                for (let index = 0; index < parcel.bookingId.length; index++) {

                    let addToTrain = document.createElement("button");

                    addToTrain.classList.add("set-station-button");
                    addToTrain.innerHTML = "<i title='addParcel' ><span> Add To Train</span></i>";
                    addToTrain.setAttribute("parcelBookingId", JSON.stringify(parcel.bookingId[index]));
                    addToTrain.onclick = addParcelsToTrain;
        
        
                    let row = document.getElementById("myParcels2").insertRow(-1);
                    row.insertCell(0).innerHTML = parcel.bookingId[index];
                    row.insertCell(1).innerHTML = parcel.item[index];
                    row.insertCell(2).append(addToTrain);             
                }                  
                
            }
            
        });
        // for (let index = 0; index < selectParcel.bookingId.length; index++) {
                
        //     let addToTrain = document.createElement("button");
    
        //     addToTrain.classList.add("set-station-button");
        //     addToTrain.innerHTML = "<i title='addParcel' ><span> Add To Train</span></i>";
        //     addToTrain.setAttribute("parcelSchedule", JSON.stringify(selectParcel[index]));
        //     // addToTrain.onclick = showSelectParcelPage;
    
    
        //     let row = document.getElementById("myParcels2").insertRow(-1);
        //     row.insertCell(0).innerHTML = selectParcel.bookingId[index];
        //     row.insertCell(1).innerHTML = selectParcel.item[index];
        //     row.insertCell(2).append(addToTrain)
            
        // }
        showSchedules();

    }catch(error){
        console.error("Error occurred:", error);
    }

    async function showSchedules() {
        const endpoint = "trainSchedule";       
        
        let startStation = selectParcel[0].sendingStation.toString();
        let endStation = station;

    
        const params = {
            startStation : startStation.toString(),
            endStation : endStation,
            date : new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        };
    
        let urlQuery = endpoint+`?json=${encodeURIComponent(JSON.stringify(params))}`;
    
        try {
    
            let schedules = await customFetch(urlQuery, {}, false);
            console.log(schedules);
            
            schedules.forEach(sch => {
                let addSchedule = document.createElement("button");
               
                addSchedule.classList.add("set-station-button");
                addSchedule.innerHTML = "<i title='addParcel' ><span> Add To Schedule</span></i>";
                addSchedule.setAttribute("parcelSchedule", JSON.stringify(sch));
                addSchedule.onclick = setSchedule;

                let row = document.getElementById("myParcels3").insertRow(-1);
                row.insertCell(0).innerHTML = sch.scheduleId;
                row.insertCell(1).append(addSchedule);   
        
            });
        } catch(error) {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        }
    }


    
  function setSchedule(){
    var parcelSchedule = JSON.parse(this.getAttribute("parcelSchedule"));
    scheduleId = parcelSchedule.scheduleId;
    console.log(scheduleId);
  }

  function addParcelsToTrain(){
    const parcelTrackingEndPoint = "parcelTracking";
    parcel = {};
    console.log(scheduleId);
    var parcelBookingId = JSON.parse(this.getAttribute("parcelBookingId"));

    parcel["bookingId"] = parcelBookingId;
    parcel["scheduleId"] = scheduleId;

    const body = parcel;
    const params = {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(body),
      method: "PUT"
    };
    customFetch(parcelTrackingEndPoint, params)
        .then(()=> window.location.reload())
        .catch((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });

  }
  





   

// Get the value of "stationParcels" from localStorage
// const selectParcel = localStorage.getItem("stationParcels");

// // Parse the JSON string into an object
// // const selectParcel = JSON.parse(selectParcelString);

// // Get the value of "recoveringStation" from the URL query parameters
// const tempUID = urlParams.get("recoveringStation");


// console.log(tempUID); // Check if "recoveringStation" is retrieved correctly

// try {
//     console.log(selectParcel); // Check the parsed object from localStorage
//     for (let index = 0; index < selectParcel.bookingId.length; index++) {
//         let addToTrain = document.createElement("button");

//         addToTrain.classList.add("set-station-button");
//         addToTrain.innerHTML = "<i title='addParcel'><span> Add To Train</span></i>";
//         addToTrain.setAttribute("parcelSchedule", JSON.stringify(selectParcel[index]));
//         // addToTrain.onclick = showSelectParcelPage;

//         let row = document.getElementById("myParcels2").insertRow(-1);
//         row.insertCell(0).innerHTML = selectParcel.bookingId[index];
//         row.insertCell(1).innerHTML = selectParcel.item[index];
//         row.insertCell(2).append(addToTrain);
//     }
// } catch (error) {
//     console.error("Error occurred:", error);
// }
