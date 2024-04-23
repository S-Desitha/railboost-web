const endpoint3 = "parcelReceiving"
console.log("Hi from PR js")

document.addEventListener("DOMContentLoaded", async function () {
    const endpoint3 = "parcelReceiving"
    let urlParams = new URLSearchParams(window.location.search);
    let scheduleId = urlParams.get("scheduleId");
    let params = {
        view: "2",
        scheduleId: scheduleId
    };
    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${endpoint3}?${queryString}`;
    
  
    try {
      let data = await customFetch(urlQuery, {credentials: "include"});
      
      data.forEach(parcelReceiving => {
        if (data.length === 0) {
            document.querySelector(".empty_msg").style.display = "block";
            return;
        }else{
            document.querySelector(".empty_msg").style.display = "none";
            let ConfirmButton = document.createElement("button");
            ConfirmButton.classList.add("approve-button");
            ConfirmButton.innerHTML = "<i title='Approve' ><span> Confirm</span></i>";
            ConfirmButton.setAttribute("parcelReceiving", JSON.stringify(parcelReceiving));
            ConfirmButton.onclick = ConfirmDelivery;
            
            let row = document.getElementById("parcelR_table").insertRow(0);
            row.insertCell(0).innerHTML = parcelReceiving.bookingId;
            row.insertCell(1).innerHTML = parcelReceiving.item;
            row.insertCell(2).innerHTML = parcelReceiving.weight;
            row.insertCell(3).innerHTML = parcelReceiving.receiverEmail;
            row.insertCell(4).append(ConfirmButton);

        }

      });
  
    }
    catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
    }
});

function ConfirmDelivery() {
    console.log("hi hi hi");
    parcelReceiving = JSON.parse(this.getAttribute("parcelReceiving"));
    console.log(parcelReceiving);

    Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5271FF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Confirm!",
    }).then((result) => {
        if (result.isConfirmed) {
            parcelReceiving["deliverStatus"] = "Received";
            const body = parcelReceiving;
            const params = {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(body),
                method: "PUT",
            };

            customFetch(endpoint3, params)

                Swal.fire({
                    title: "Parcel delivery is confirmed and sent email to the reciver.",
                    // text: "The rate has been successfully updated!",
                    icon: "success",
                }).then((result) => {
                    if (result.isConfirmed) window.location.reload();
                
                })
                .then(() => {
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