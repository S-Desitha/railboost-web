const endpoint3 = "rates"
console.log("Hi from rates js")

document.addEventListener("DOMContentLoaded", async function () {
  const endpoint3 = "rates"
  
    // document.getElementById("rate-form").reset();
  
    try {
      let data = await customFetch(endpoint3, {});
      
      data.forEach(rate => {
        console.log(data);
        console.log("Processing rate:", rate);
        let editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerHTML = "<i class='fas fa-edit'></i>";
        editButton.setAttribute("rate", JSON.stringify(rate));
        editButton.onclick = editRate;
        console.log(editButton);
  
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
        deleteButton.setAttribute("rate", JSON.stringify(rate));
        deleteButton.onclick = deleteRate;
        console.log(deleteButton);


        
        let row = document.getElementById("rate_table").insertRow(-1);
        row.insertCell(0).innerHTML = rate.startStation;
        row.insertCell(1).innerHTML = rate.endStation;
        row.insertCell(2).innerHTML = rate.firstClass;
        row.insertCell(3).innerHTML = rate.secondClass;
        row.insertCell(4).innerHTML = rate.thirdClass;
        row.insertCell(5).append(editButton, deleteButton);

        console.log("Row added successfully.");
      });
  
    }
    catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
    }
  });

  function editRate() {
    rate = JSON.parse(this.getAttribute("rate"));
    console.log(rate);
  
    const button = document.getElementById("add-new-price-rate");
  
    document.getElementById("add-new-price-header").innerHTML = "Update Rate";
    button.innerHTML = "Update";
  
    let StartSField = document.getElementById("from");
    StartSField.value = rate["startStation"]
    StartSField.disabled = true;

    let EndSField = document.getElementById("to");
    EndSField.value = rate["endStation"]
    EndSField.disabled = true;
  
    document.getElementById("1class-price").value = train["1st Class"];
    document.getElementById("2class-price").value = train["2nd Class"];
    document.getElementById("3class-price").value = train["3rd Class"];
  
    button.setAttribute("rate", JSON.stringify(rate));
    button.onclick = updateRate;
  }
  
  
  
  function deleteRate() {
    train = JSON.parse(this.getAttribute("train"));
    console.log(train);
  
    let confirm = window.confirm("Are you sure you want to delete train with id " + train["trainId"]);
    if (confirm) {
      const body = train;
      const params = {
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(body),
        method: "DELETE"
      };
  
      fetch(url, params)
        .then(res => {
          if (res.ok) {
            window.location.reload();
          }
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
  
  
  
  function updateRate() {
    train = {};
  
  
    train["trainId"] = document.getElementById("trainId").value;
    train["trainType"] = document.getElementById("trainType").value;
    console.log(train);
    const body = train;
    const params = {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(body),
      method: "PUT"
    };
  
    fetch(url, params)
      .then(res => {
        if (res.ok) {
          window.location.reload();
        }
      });
  
    console.log(train);
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