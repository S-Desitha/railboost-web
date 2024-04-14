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
  
    
    const dialogModal = document.querySelector('.dialog-modal');
    dialogModal.showModal();
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
    // close any opened dilalogs
    const dialogModal = document.querySelector('.dialog-modal');
    dialogModal.close();
    rate = {};
    rate["startCode"] = document.getElementById("from").getAttribute("stationCode");
    rate["endCode"] = document.getElementById("to").getAttribute("stationCode");
    rate["startStation"] = document.getElementById("from").getAttribute("stationName");
    rate["endStation"] = document.getElementById("to").getAttribute("stationName");
    rate["firstClass"] = document.getElementById("1class-price").value;
    rate["secondClass"] = document.getElementById("2class-price").value;
    rate["thirdClass"] = document.getElementById("3class-price").value;

    Swal.fire({
        title: "Are you sure?",
        text: `Are you sure you want to edit rate from ${rate["startStation"]} to ${rate["endStation"]}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5271FF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, edit it!",
    }).then((result) => {
        if (result.isConfirmed) {
            const body = rate;
            const params = {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(body),
                method: "PUT",
            };

            customFetch(endpoint3, params)
                .then(() => {
                    Swal.fire({
                        title: "Rate Updated",
                        text: "The rate has been successfully updated!",
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
            // Clear the form if cancel is clicked
            Swal.fire("Cancelled", "Your operation has been cancelled", "error");
            const button = document.getElementById("add-new-price-rate");
  
    document.getElementById("add-new-price-header").innerHTML = "Add a New Price Rate";
    button.innerHTML = "Add a New Price Rate";
            clearForm();
        }
        
    });
}

function clearForm() {
    document.getElementById("from").setAttribute("stationCode", "");
    document.getElementById("from").setAttribute("stationName", "");
    document.getElementById("to").setAttribute("stationCode", "");
    document.getElementById("to").setAttribute("stationName", "");
    document.getElementById("from").querySelector(".select-btn span").innerText= "Start Station:";
    document.getElementById("to").querySelector(".select-btn span").innerText= "End Station:";
    
    document.getElementById("1class-price").value = "";
    document.getElementById("2class-price").value = "";
    document.getElementById("3class-price").value = "";
}


  
function deleteRate() {
  rate = JSON.parse(this.getAttribute("rate"));
  console.log(rate);

  Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete rate from ${rate["startStation"]} to ${rate["endStation"]}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5271FF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
  }).then((result) => {
      if (result.isConfirmed) {
          const body = rate;
          const params = {
              headers: {
                  "Content-type": "application/json; charset=UTF-8",
              },
              body: JSON.stringify(body),
              method: "DELETE",
          };

          customFetch(endpoint3, params)
              .then(() => {
              Swal.fire({
                title: "Rate Deleted",
                text: "The rate has been successfully deleted!",
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) window.location.reload();
            
            })
        })
              .catch((error) => {
                  if (error == "login-redirected")
                      localStorage.setItem("last_url", window.location.pathname);
              });
      }
      else {
    Swal.fire("Cancelled", "Your operation has been cancelled", "error");
      }
      
  });
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
        .then(()=> {
            Swal.fire({
                title: "New Rate Added",
                text: "A  new rate has been successfully added!",
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) window.location.reload();
            
            })
            
        })
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

