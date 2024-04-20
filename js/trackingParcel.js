const parcelTrackingEndPoint =  "parcelTracking";
document.addEventListener("DOMContentLoaded",async function(){

    // let ParcelDetails = {recoveryStation:"", 
    //                     bookingId:[],
    //                     numberOfParcels:0
    //                    };

    var stationParcels = [];
    

    try{

        let data = await customFetch(parcelTrackingEndPoint, {});

        data.forEach(parcel => {
            for (let i=0; i<stationParcels.length; i++) {
                if (parcel.recoveringStation==stationParcels[i].recoveringStation) {
                    stationParcels[i].numberOfParcels++;
                    stationParcels[i].bookingId.push(parcel.bookingId)
                    break;
                }
                if (i==stationParcels.length-1) {
                    stationParcels.push({
                        recoveringStation: parcel.recoveringStation,
                        bookingId: [parcel.bookingId],
                        numberOfParcels: 1
                    });
                    break;
                }
            }
            if (stationParcels.length==0) {
                stationParcels.push({
                    recoveringStation: parcel.recoveringStation,
                    bookingId: [parcel.bookingId],
                    numberOfParcels: 1
                });
            }
        });

        for (let index = 0; index < stationParcels.length; index++) {
            
            let addParcelsSchedule = document.createElement("button");

            addParcelsSchedule.classList.add("set-station-button");
            addParcelsSchedule.innerHTML = "<i title='addParcel' ><span> Add Parcel</span></i>";
            addParcelsSchedule.setAttribute("parcelSchedule", JSON.stringify(stationParcels[index]));
            addParcelsSchedule.onclick = showSelectParcelPage;


            let row = document.getElementById("myParcels").insertRow(-1);
            row.insertCell(0).innerHTML = stationParcels[index].recoveringStation;
            row.insertCell(1).innerHTML = stationParcels[index].numberOfParcels
            row.insertCell(2).append(addParcelsSchedule)
            
        }
        
    //     console.log(stations);
    //     stations.push(data[0].recoveringStation);
    //     data.forEach(myParcels => {
    //         let addParcelsSchedule = document.createElement("button");
    //         addParcelsSchedule.classList.add("approve-button");
    //         addParcelsSchedule.innerHTML = "<i title='Approve' ><span> Add Parcel</span></i>";
    //         addParcelsSchedule.setAttribute("parcelSchedule", JSON.stringify(myParcels));
    //         // addParcelsSchedule.onclick = approveParcelF;

    //         let row = document.getElementById("myParcels").insertRow(-1);
    //         var count = 0;

    //         ParcelDetails.recoveryStation = myParcels.recoveringStation;
    //         ParcelDetails.bookingId = myParcels.bookingId;
    //         ParcelDetails.numberOfParcels=0;
    //         ParcelDetails.trackingId= myParcels.trackingId;
    //         stations.push(myParcels.recoveringStation);
            
    //         for (let i = 0; i < stations.length; i++) {
    //             console.log(myParcels.recoveringStation);
    //             if(myParcels.recoveringStation==stations[i]){
    //                     console.log(stations[i]);
    //                     count++;
    //             }
    //         }
    //         console.log(count);
    //         if(count==0){
    //             stations.push(myParcels.recoveringStation)
    //             row.insertCell(0).innerHTML = myParcels.recoveringStation;
    //             row.insertCell(1).append(addParcelsSchedule)

    //         }
    // });
    }catch(error){
        if (error=="login-redirected")
        localStorage.setItem("last_url", window.location.pathname); 
    }

    console.log(stationParcels)

});

