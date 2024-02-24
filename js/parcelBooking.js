//const url = "http://localhost:8080/railboost_backend_war_exploded/parcelBooking"
const parcelBookingEndpoint = "parcelBooking";

// document.addEventListener("DOMContentLoaded",async function(){
//     document.getElementById("parcelBooking_form").reset();

//     let data = await customFetch(endpoint2, {Credential: "include"});
//     try{
//             data.forEach(parcel => {
//             let row = document.getElementById("parcelBooking_table").insertRow(-1);
//             row.insertCell(0).innerHTML = parcel.bookingId;
            
//         });
//     }catch(error){
//             if (error=="login-redirected")
//             localStorage.setItem("last_url", window.location.pathname); 
//     }
    
    
// });


function addNewParcel() {
    parcel = {};

    parcel["sendingStation"] = document.getElementById("sendingStaion").value;
    parcel["senderAddress"] = document.getElementById("senderAddress").value;
    parcel["SenderNIC"] = document.getElementById("senderNIC").value;
    parcel["recoveringStation"] = document.getElementById("railwayStation").value;
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


  