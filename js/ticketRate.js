const endpoint3 = "rates"
console.log("Hi from rates js")

document.addEventListener("DOMContentLoaded", async function () {
  const endpoint3 = "rates"
  
    // document.getElementById("rate-form").reset();
  
    try {
      let data = await customFetch(endpoint3, {});
      
      data.forEach(rate => {
        // console.log(data);
        // console.log("Processing rate:", rate);
        let editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerHTML = "<i class='fas fa-edit'></i>";
        editButton.setAttribute("rate", JSON.stringify(rate));
        editButton.onclick = editRate;
        // console.log(editButton);
  
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
        deleteButton.setAttribute("rate", JSON.stringify(rate));
        deleteButton.onclick = deleteRate;
        // console.log(deleteButton);


        
        let row = document.getElementById("rate_table").insertRow(-1);
        row.insertCell(0).innerHTML = rate.startStation;
        row.insertCell(1).innerHTML = rate.endStation;
        row.insertCell(2).innerHTML = rate.firstClass;
        row.insertCell(3).innerHTML = rate.secondClass;
        row.insertCell(4).innerHTML = rate.thirdClass;
        row.insertCell(5).append(editButton, deleteButton);

        // console.log("Row added successfully.");
      });
  
    }
    catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
    }
  });

  function editRate() {
    rate = JSON.parse(this.getAttribute("rate"));
    console.log("1=");
    console.log(rate);
  
    const button = document.getElementById("add-new-price-rate");
  
    document.getElementById("add-new-price-header").innerHTML = "Update Rate";
    button.innerHTML = "Update";
  
    let startWrapper = document.getElementById("from");
    let endWrapper = document.getElementById("to");

    startWrapper.querySelector(".select-btn span").innerText = rate["startStation"];
    startWrapper.setAttribute("stationCode", rate["startCode"]);
    startWrapper.setAttribute("stationName", rate["startStation"]);
    startWrapper.style.pointerEvents = "none";

    endWrapper.querySelector(".select-btn span").innerText = rate["endStation"];
    endWrapper.setAttribute("stationCode", rate["endCode"]);
    endWrapper.setAttribute("stationName", rate["endStation"]);
    endWrapper.style.pointerEvents = "none";
  
    document.getElementById("1class-price").value = rate["firstClass"];
    document.getElementById("2class-price").value = rate["secondClass"];
    document.getElementById("3class-price").value = rate["thirdClass"];
    
    console.log(rate);
    button.setAttribute("rate", JSON.stringify(rate));
    button.onclick = updateRate;
  }

  function updateRate() {
    rate = {};
    
   

    rate["startCode"] =document.getElementById("from").getAttribute("stationCode");
    rate["endCode"] =document.getElementById("to").getAttribute("stationCode");
    rate["firstClass"] = document.getElementById("1class-price").value;
    rate["secondClass"] = document.getElementById("2class-price").value;
    rate["thirdClass"] = document.getElementById("3class-price").value;
    console.log(rate)
    
    const body = rate;
    const params = {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(body),
      method: "PUT"
    };
  
    customFetch(endpoint3, params)
        .then(()=> window.location.reload())
        .catch((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });

  
    
  }
  
  
  
  function deleteRate() {
    rate = JSON.parse(this.getAttribute("rate"));
    console.log(rate);
  
    let confirm = window.confirm("Are you sure you want to delete rate from " + rate["startStation"] + " to " + rate["endStation"]);
    if (confirm) {
      const body = rate;
      const params = {
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(body),
        method: "DELETE"
      };
  
      customFetch(endpoint3, params)
      .then(()=> window.location.reload())
      .catch((error) => {
          if (error=="login-redirected")
              localStorage.setItem("last_url", window.location.pathname);
      });
    }
  }
  
  
  
  function addNewRate() {
    rate = {};
    console.log("hi from rate")
    rate["startCode"] =document.getElementById("from").getAttribute("stationCode");
    rate["endCode"] =document.getElementById("to").getAttribute("stationCode");
    rate["firstClass"] = document.getElementById("1class-price").value;
    rate["secondClass"] = document.getElementById("2class-price").value;
    rate["thirdClass"] = document.getElementById("3class-price").value;
  
    const body = rate;
    const params = {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(body),
      method: "POST"
    };
  
    customFetch(endpoint3, params)
        .then(()=> window.location.reload())
        .catch((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });

  
    console.log(rate);
  }
  
  
  

  

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

