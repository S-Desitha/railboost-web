const selectParcelString = localStorage.getItem("stationParcels");
const selectParcel = JSON.parse(selectParcelString)
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
                    addToTrain.setAttribute("parcelSchedule", JSON.stringify(parcel));
                    // addToTrain.onclick = showSelectParcelPage;
        
        
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

    }catch(error){

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
