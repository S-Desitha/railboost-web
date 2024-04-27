//const url = "http://localhost:8080/railboost_backend_war_exploded/parcelBooking"
const parcelBookingEndpoint = "parcelBooking";
const parcelCategoryEndpoint = "parcelCategory";


document.addEventListener("DOMContentLoaded",async function(){
    document.getElementById("parcelBooking_form").reset();
    var hasDataDiv = document.getElementById("hasDataDiv");
    var noDataDiv = document.getElementById("noDataDiv");
    hasDataDiv.style.display = "none";
    noDataDiv.style.display = "none";

    getCategory();

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
            row.insertCell(6).innerHTML = parcel.deliver_status;   
            
        });
    }catch(error){
            if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname); 
    }       
});


function addNewParcel() {
  const parcel = {};

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
  parcel["category"] = document.getElementById("parcelCategory").value;

  closeDialog();

  const body = JSON.stringify(parcel);
  const params = {
      headers: {
          "Content-type": "application/json; charset=UTF-8"
      },
      body: body,
      method: "POST"
  };

  customFetch(parcelBookingEndpoint, params)
      .then((response) => {
        console.log(response)
          if (response.status == 200) {
              // Show SweetAlert for success
              Swal.fire({
                  title: "Success!",
                  text: "Your parcel booking application has been submitted successfully.",
                  icon: "success",
                  confirmButtonColor: "#5271FF",
                  confirmButtonText: "OK"
              }).then(() => {
                  // Optionally, reload the page or redirect to another page
                  window.location.reload();
              });
          } else {
              // Show error message if needed
              Swal.fire({
                  title: "Error!",
                  text: "There was an error submitting your parcel booking application. Please try again.",
                  icon: "error",
                  confirmButtonColor: "#5271FF",
                  confirmButtonText: "OK"
              });
          }
      })
      .catch((error) => {
          // Handle fetch error here
          if (error == "login-redirected") {
              localStorage.setItem("last_url", window.location.pathname);
          }
          console.error("Error:", error);
      });
}






function openDialog() {
  
  getCategory();
  var myDialog = document.getElementById('myDialog');
  myDialog.showModal();
  }

function closeDialog() {
  var myDialog = document.getElementById('myDialog');
  myDialog.close();
  }
  async function getCategory(){
    try{
      var data = await customFetch(parcelCategoryEndpoint, {}, false);

      console.log(data)

      var select = document.getElementById('parcelCategory');
      data.forEach(category => {
        var opt = document.createElement('option');
        opt.value = category.itemId;
        opt.innerHTML = category.specialItem;;
        select.appendChild(opt);
      });
    }catch{

    }
    popupAddPage('.staff-add_edit-modal')
    
  }

  