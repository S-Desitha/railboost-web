//const url = "http://localhost:8080/railboost_backend_war_exploded/parcelBooking"
const parcelBookingEndpoint = "parcelBooking";


document.addEventListener("DOMContentLoaded",async function(){
    document.getElementById("parcelBooking_form").reset();
    var hasDataDiv = document.getElementById("hasDataDiv");
    var noDataDiv = document.getElementById("noDataDiv");
    hasDataDiv.style.display = "none";
    noDataDiv.style.display = "none";

    let data = await customFetch(parcelBookingEndpoint, {});

    if (Array.isArray(data) && data.length !== 0) {
     //var hasDataDiv =  document.getElementById("hasDataDiv");
      //var noDataDiv = document.getElementById("noDataDiv");
      hasDataDiv.style.display = "flex";
      //noDataDiv.style.display = "none";
  } else {

      // var hasData =  document.getElementById("hasDataDiv");
      //var noDataDiv = document.getElementById("noDataDiv");
      // hasData.style.display = "none";
      noDataDiv.style.display = "flex";
  }
    try{
            data.forEach(parcel => {
            let row = document.getElementById("parcelBooking_table").insertRow(-1);
            row.insertCell(0).innerHTML = parcel.receiverName;
            row.insertCell(1).innerHTML = parcel.bookingId;
            row.insertCell(2).innerHTML = parcel.receiverAddress; 
            row.insertCell(3).innerHTML = parcel.receiverEmail;
            row.insertCell(4).innerHTML = parcel.item;   
            row.insertCell(5).innerHTML = parcel.status;        
            
        });
    }catch(error){
            if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname); 
    }       
});


function addNewParcel() {
    parcel = {};

    parcel["sendingStation"] = document.getElementById("from").getAttribute("stationCode");
    parcel["senderAddress"] = document.getElementById("senderAddress").value;
    parcel["SenderNIC"] = document.getElementById("senderNIC").value;
    parcel["recoveringStation"] = document.getElementById("to").getAttribute("stationCode");
    parcel["receiverName"] = document.getElementById("receiverName").value;
    parcel["receiverAddress"] = document.getElementById("receiverAddress").value;
    parcel["receiverNIC"] = document.getElementById("receiverNIC").value;
    parcel["receiverTelNo"] = document.getElementById("phone-field").value;
    parcel["receiverEmail"] = document.getElementById("email-field").value;
    parcel["item"] = document.getElementById("item").value;
   

    const body = parcel;
    const params = {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(body),
      method: "POST"
    };
    customFetch(parcelBookingEndpoint, params)
        .then(()=> window.location.reload())
        .catch((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });

    console.log(parcel);
}






function openDialog() {
    var myDialog = document.getElementById('myDialog');
    myDialog.showModal();
  }

  function closeDialog() {
    var myDialog = document.getElementById('myDialog');
    myDialog.close();
  }


  