const endpoint3 = "rates"
console.log("Hi from rates js")

document.addEventListener("DOMContentLoaded", async function () {
  
    // document.getElementById("rate-form").reset();
  
    try {
      let data = await customFetch(endpoint3, {});
  
      data.forEach(rate => {
        let editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerHTML = "<i class='fas fa-edit'></i>";
        editButton.setAttribute("rate", JSON.stringify(rate));
        editButton.onclick = editRate;
  
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
        deleteButton.setAttribute("rate", JSON.stringify(rate));
        deleteButton.onclick = deleteTrain;
  
        let row = document.getElementById("rate_table").insertRow(-1);
        row.insertCell(0).innerHTML = rate.startStation;
        row.insertCell(1).innerHTML = rate.endStation;
        row.insertCell(2).innerHTML = rate.firstClass;
        row.insertCell(3).innerHTML = rate.secondClass;
        row.insertCell(4).innerHTML = rate.thirdClass;
        row.insertCell(5).append(editButton, deleteButton);
      });
  
    }
    catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
    }
  });
  

function validateStation(){
  
    let Start=document.getElementById("from").getAttribute("stationCode");
    let End=document.getElementById("to").getAttribute("stationCode");
    let StationError=document.getElementById("station-error");
    if(Start==End){
        StationError.innerHTML = "Both start and end stations can't be same.";
        return false;
    }
        StationError.innerHTML = "";
        return true;
}