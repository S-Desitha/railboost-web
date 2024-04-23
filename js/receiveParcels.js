const endpoint3 = "parcelReceiving"
console.log("Hi from PR js")

document.addEventListener("DOMContentLoaded", async function () {
    const endpoint3 = "parcelReceiving"
    let params = {
        view: "1",
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
            let viewButton = document.createElement("button");
            viewButton.classList.add("view-button");
            viewButton.innerHTML = "<i class='fa-solid fa-eye' title='View Application' style='color:#0047AB'><span>  View</span></i>";
            viewButton.setAttribute("parcelReceiving", JSON.stringify(parcelReceiving));
            viewButton.onclick = viewParcels;
            
            let row = document.getElementById("parcelR_table").insertRow(0);
            row.insertCell(0).innerHTML = parcelReceiving.scheduleId;
            row.insertCell(1).innerHTML = parcelReceiving.pCount;
            row.insertCell(2).append(viewButton);

        }

      });
  
    }
    catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
    }
});

function viewParcels() {
    console.log("hi hi hi");
    parcelReceiving = JSON.parse(this.getAttribute("parcelReceiving"));

    let url = "http://localhost:5500/html/sm/confirmDelivery.html" + "?scheduleId=" + encodeURIComponent(parcelReceiving.scheduleId);
    window.location.href = url;
}