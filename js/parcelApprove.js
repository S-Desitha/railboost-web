const approveParcelEndPoint =  "approveParcel";

document.addEventListener("DOMContentLoaded",async function(){
    
    let data = await customFetch(approveParcelEndPoint, {});

    try{
        data.forEach(approveParcel => {
        let row = document.getElementById("parcelApprove_table").insertRow(-1);
        row.insertCell(0).innerHTML = approveParcel.bookingId;
        row.insertCell(1).innerHTML = approveParcel.senderName;
        row.insertCell(2).innerHTML = approveParcel.receiverName; 
        row.insertCell(3).innerHTML = approveParcel.recoveringStation;
        row.insertCell(4).innerHTML = approveParcel.item;  
        row.insertCell(5).innerHTML = approveParcel.status;      
        
    });
}catch(error){
        if (error=="login-redirected")
        localStorage.setItem("last_url", window.location.pathname); 
}

});
