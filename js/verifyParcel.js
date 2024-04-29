
const approveParcelEndPoint =  "verifyParcel";

document.addEventListener("DOMContentLoaded",async function(){
    
    

    try{

        let data = await customFetch(approveParcelEndPoint, {});

        data.forEach(verifyParcel => {
        let veributton = document.createElement("button");
        veributton.classList.add("verify-button");
        veributton.innerHTML = "<i class='fa-solid fa-check' style='color:white;' title='verify' ><span>  Verify </span></i>";
        veributton.setAttribute("verifyParcel", JSON.stringify(verifyParcel));
        veributton.onclick = function() {openDialog(verifyParcel.bookingId);}
        // let verifyButton = document.createElement("button");
        // verifyButton.classList.add("veributtonfy-");
        // verifyButton.innerHTML = "<i tital='verify' > <span> Verify </span></i>";
        // verifyButton.setAttribute("parcelVerifing", JSON.stringify(parcelReceiving));
        // verifyButton.onclick = openDialog;

        
        if (data.length === 0) {
            document.querySelector(".empty_msg").style.display = "block";
            return;
        }else{
            document.querySelector(".empty_msg").style.display = "none";
        let row = document.getElementById("verifyTable").insertRow(-1);
        row.insertCell(0).innerHTML = verifyParcel.receiverName;
        row.insertCell(1).innerHTML = verifyParcel.bookingId;
        row.insertCell(2).innerHTML = verifyParcel.receiverAddress; 
        row.insertCell(3).innerHTML = verifyParcel.receiverEmail;
        row.insertCell(4).innerHTML = verifyParcel.receiverNIC;
        row.insertCell(5).innerHTML = verifyParcel.item;
        row.insertCell(6).append(veributton);
        }
    });
}catch(error){
        if (error=="login-redirected")
        localStorage.setItem("last_url", window.location.pathname); 
}

});

async function  verifyCode(bookingId){

    console.log(bookingId);

    // var verifyParcel = JSON.parse(this.getAttribute("verifyParcel"));
    // var bookingId1 = verifyParcel.bookingId;

    endpoint4 = "checkOTP"
    var OTP = document.getElementById("verifyParcel").value;
    console.log(OTP);
    const body = {
        bookingId:bookingId,
        OTP :OTP 
        };
    const params = {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(body),
      method: "POST"
    };


    let data = await customFetch(endpoint4, params)
    closeDialog();
    if(data.isSuccessful){
        Swal.fire({
            title: data.error,
            icon: "success",

        })
    .then((result) => {
        if (result.isConfirmed) window.location.reload();
    
    })
    .then(() => {
    })
    .catch((error) => {
        if (error == "login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    });


    }else{
        Swal.fire({
            title: data.error,
            icon: "warning",

        })
        
    }

// }
}

function openDialog(bookingId) {
    var myDialog = document.getElementById('verifiID');
    myDialog.showModal();

    myDialog.addEventListener('click', function(event) {
        if (event.target === myDialog) {
          myDialog.close();
        }
      });
    
    document.getElementById("verify-parcel-btn").addEventListener("click", function(){verifyCode(bookingId)})
  }

