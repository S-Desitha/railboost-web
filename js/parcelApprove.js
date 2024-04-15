
const approveParcelEndPoint =  "approveParcel";

document.addEventListener("DOMContentLoaded",async function(){
    
    let data = await customFetch(approveParcelEndPoint, {});

    try{


        data.forEach(approveParcel => {
        let approveButton = document.createElement("button");
        approveButton.classList.add("approve-button");
        approveButton.innerHTML = "<i title='Approve' ><span>  Approve </span></i>";
        approveButton.setAttribute("approveParcel", JSON.stringify(approveParcel));
        approveButton.onclick = approveParcelF;

        let rejectButton = document.createElement("button");
        rejectButton.classList.add("reject-button");
        rejectButton.innerHTML = "<i title='Reject' ><span>  Reject</span></i>";
        rejectButton.setAttribute("rejectParcel", JSON.stringify(approveParcel));
        rejectButton.onclick = rejectParcel;   

        let addWeightButton = document.createElement("button");
        addWeightButton.add("view-button");
        addWeightButton.innerHTML = "<i class='fa-solid fa-eye' title='View Application' style='color:#0047AB'><span>  View</span></i>";
        addWeightButton.setAttribute("addWeight", JSON.stringify(approveParcel));
        addWeightButton.onclick = addWeight;

        

        let row = document.getElementById("parcelApprove_table").insertRow(-1);
        row.insertCell(0).innerHTML = approveParcel.bookingId;
        row.insertCell(1).innerHTML = approveParcel.senderName;
        row.insertCell(2).innerHTML = approveParcel.receiverName; 
        row.insertCell(3).innerHTML = approveParcel.recoveringStation;
        row.insertCell(4).innerHTML = approveParcel.item;
        // row.insertCell(5).innerHTML = approveParcel.weight;
        // row.insertCell(6).append(editButton);
        // row.insertCell(7).innerHTML = approveParcel.total;  
        row.insertCell(8).innerHTML = approveParcel.status;   
        row.insertCell(9).append(approveButton, rejectButton);
   
        
    });
}catch(error){
        if (error=="login-redirected")
        localStorage.setItem("last_url", window.location.pathname); 
}

});


function rejectParcel() {
    var parcelStatus = JSON.parse(this.getAttribute("rejectParcel"));
    

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5271FF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reject it!",
    }).then((result) => {
        if (result.isConfirmed) {

            

            parcelStatus["status"] = "Rejected";
            const body = parcelStatus;
            const params = {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(body),
                method: "PUT",
            };

            customFetch(approveParcelEndPoint, params)
                .then(() => {
                    Swal.fire({
                        title: "Application is Rejected",
                        // text: "The rate has been successfully updated!",
                        icon: "success",
                    }).then((result) => {
                        if (result.isConfirmed) window.location.reload();
                    
                    })
                    
                })
                .catch((error) => {
                    if (error == "login-redirected")
                        localStorage.setItem("last_url", window.location.pathname);
                });
        } else {
            Swal.fire("Cancelled", "Your operation has been cancelled", "error");
            
        }
    });
}


function approveParcelF() {
    parcelStatus = JSON.parse(this.getAttribute("approveParcel"));
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this'!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5271FF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, approve it!",
    }).then((result) => {
        if (result.isConfirmed) {
            parcelStatus["status"] = "Approved";
            const body = parcelStatus;
            const params = {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(body),
                method: "PUT",
            };

            customFetch(approveParcelEndPoint, params)
                .then(() => {
                    Swal.fire({
                        title: "Application is Approved",
                        // text: "The rate has been successfully updated!",
                        icon: "success",
                    }).then((result) => {
                        if (result.isConfirmed) window.location.reload();
                    
                    })
                    
                })
                .catch((error) => {
                    if (error == "login-redirected")
                        localStorage.setItem("last_url", window.location.pathname);
                });
        } else {
            Swal.fire("Cancelled", "Your operation has been cancelled", "error");
            
        }
    });
}
function addWeight(){

}