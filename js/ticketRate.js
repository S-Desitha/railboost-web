const endpoint3 = "rates"
console.log("Hi from rates js")

// document.addEventListener("DOMContentLoaded", async function () {
//   const endpoint3 = "rates"
  
//     // document.getElementById("rate-form").reset();
  
//     try {
//       let data = await customFetch(endpoint3, {});
      
//       data.forEach(rate => {
//         // console.log(data);
//         // console.log("Processing rate:", rate);
//         let editButton = document.createElement("button");
//         editButton.classList.add("edit-button");
//         editButton.innerHTML = "<i class='fas fa-edit'></i>";
//         editButton.setAttribute("rate", JSON.stringify(rate));
//         editButton.onclick = editRate;
//         // console.log(editButton);
  
//         let deleteButton = document.createElement("button");
//         deleteButton.classList.add("delete-button");
//         deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
//         deleteButton.setAttribute("rate", JSON.stringify(rate));
//         deleteButton.onclick = deleteRate;
//         // console.log(deleteButton);


        
//         let row = document.getElementById("rate_table").insertRow(-1);
//         row.insertCell(0).innerHTML = rate.startStation;
//         row.insertCell(1).innerHTML = rate.endStation;
//         row.insertCell(2).innerHTML = rate.firstClass;
//         row.insertCell(3).innerHTML = rate.secondClass;
//         row.insertCell(4).innerHTML = rate.thirdClass;
//         row.insertCell(5).append(editButton, deleteButton);

//         // console.log("Row added successfully.");
//       });
  
//     }
//     catch(error) {
//       if (error=="login-redirected")
//           localStorage.setItem("last_url", window.location.pathname);
//     }
//   });




  const rowsPerPage = 10;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", async function () {

  try {
    const data = await getTRates(rowsPerPage, (currentPage - 1) * rowsPerPage);
    populateTable(data);
  } catch (error) {
    if (error == "login-redirected") {
      localStorage.setItem("last_url", window.location.pathname);
    }
  }
});

async function getTRates(limit, offset) {
  
  let params = {
    limit: limit,
    offset: offset,
  };
  let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
  let urlQuery = `${endpoint3}?${queryString}`;

  const data = await customFetch(urlQuery, {credentials: "include"});
  console.log("Response from backend:", data);
  updatePaginationButtons(currentPage);
  return data;
}

function populateTable(rates) {
  const tableBody = document.getElementById("rate_table");
  tableBody.innerHTML = "";

  rates.forEach((rate) => {
    let editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.innerHTML = "<i class='fas fa-edit'></i>";
    editButton.setAttribute("rate", JSON.stringify(rate));
    editButton.onclick = editRate;

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
    deleteButton.setAttribute("rate", JSON.stringify(rate));
    deleteButton.onclick = deleteRate;

    let row = tableBody.insertRow(-1);
    row.insertCell(0).innerHTML = rate.startStation;
    row.insertCell(1).innerHTML = rate.endStation;
    row.insertCell(2).innerHTML = rate.firstClass;
    row.insertCell(3).innerHTML = rate.secondClass;
    row.insertCell(4).innerHTML = rate.thirdClass;
    row.insertCell(5).append(editButton, deleteButton);
  });
}

function updatePaginationButtons(pageNum) {
  document.getElementById('current-page').textContent = pageNum;

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  prevBtn.disabled = pageNum === 1;
}

// Add event listeners for the pagination buttons
function goToPrevPage() {
    currentPage--;
    getTRates(rowsPerPage, (currentPage - 1) * rowsPerPage)
      .then(populateTable)
      .catch((error) => {
        if (error == "login-redirected") {
          localStorage.setItem("last_url", window.location.pathname);
        }
      });
}

function goToNextPage() {
    currentPage++;
    getTRates(rowsPerPage, (currentPage - 1) * rowsPerPage)
      .then(populateTable)
      .catch((error) => {
        if (error == "login-redirected") {
          localStorage.setItem("last_url", window.location.pathname);
        }
      });
}

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
    
    rate = {};
    rate["startCode"] = document.getElementById("from").getAttribute("stationCode");
    rate["endCode"] = document.getElementById("to").getAttribute("stationCode");
    rate["startStation"] = document.getElementById("from").getAttribute("stationName");
    rate["endStation"] = document.getElementById("to").getAttribute("stationName");
    rate["firstClass"] = document.getElementById("1class-price").value;
    rate["secondClass"] = document.getElementById("2class-price").value;
    rate["thirdClass"] = document.getElementById("3class-price").value;

    if (!rate["startCode"] || !rate["endCode"] || !rate["firstClass"] || !rate["secondClass"] || !rate["thirdClass"]) {
        return;
    }
    dialogModal.close();

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

  
  
  
  async function addNewRate() {
    rate = {};
    console.log("hi from rate")
    rate["startCode"] =document.getElementById("from").getAttribute("stationCode");
    rate["endCode"] =document.getElementById("to").getAttribute("stationCode");
    rate["firstClass"] = document.getElementById("1class-price").value;
    rate["secondClass"] = document.getElementById("2class-price").value;
    rate["thirdClass"] = document.getElementById("3class-price").value;

    if (!rate["startCode"] || !rate["endCode"] || !rate["firstClass"] || !rate["secondClass"] || !rate["thirdClass"]) {
        return;
    }
  
    const body = rate;
    const params = {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(body),
      method: "POST"
    };
  
    
    const response=await customFetch(endpoint3, params)
        if (response.isSuccessful) {
            closeDialog();
            Swal.fire({
                title: "New Rate Added",
                text: "A  new rate has been successfully added!",
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) window.location.reload();
            
            });
            
        }else{
            closeDialog();
            Swal.fire({
                title: "Error!",
                text: "Rates are available for provided stations.",
                icon: "error",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) window.location.reload();
            
            });

        }

  
    console.log(rate);
  }
  
  
function validatePrice(inputId) {
    const inputElement = document.getElementById(inputId);
    const priceError = document.getElementById(inputId + "-error");

    const inputValue = inputElement.value;

    if (!isNaN(inputValue) && inputValue > 0) {
        priceError.textContent = "";
    } else {
        priceError.textContent = "Please enter a valid number greater than 0.";
    }
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


async function DownloadExel(){
    let  stationCode= document.getElementById("addingStation").getAttribute("stationCode");
    let params = {
        isTemplate: true,
        stationCode: stationCode,
      };
      let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
      let urlQuery = `${endpoint3}?${queryString}`;
      console.log(urlQuery);
      
      await customFetch1(urlQuery, {credentials: "include"})
      .then((blob) => {
        const aElement = document.createElement("a");
        const currentDate = new Date();
        let formattedDate = (currentDate.getMonth() + 1).toString().padStart(2, '0') + '/' + currentDate.getDate().toString().padStart(2, '0') + '/' + currentDate.getFullYear();


        const fileName = stationCode+"-"+formattedDate;
        aElement.setAttribute("download", fileName);
        const href = URL.createObjectURL(blob);
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        aElement.click();
        URL.revokeObjectURL(href);
      });

}

function EnableBtn1(){
    document.getElementById("download-btn").disabled = false;
    document.getElementById("exel").disabled = false;
}

function EnableSubmit(){
    document.getElementById("upload-btn").disabled = false;
}

async function Upload(){
    rate = {};
    rate["startCode"] = document.getElementById("addingStation").getAttribute("stationCode");

    const fileInput = document.getElementById("exel");
    const file = fileInput.files[0];

    let formData = new FormData(); 

    const body = JSON.stringify(rate);
    formData.append("jsonObj",body);
    formData.append("file",file);

    if (rate["startCode"] && file) {
        const params = {
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            },
            body: formData,
            method: "POST",
            credentials: "include"
          };
    

          const response = await customFetch(endpoint3, params)
          console.log(response);
          if (response.isSuccessful) {
            closeDialog();
              Swal.fire({
                  title: "Success!",
                  text: "New Rates Added.",
                  icon: "success"
              }).then(() => window.location.reload());
          }else{
            closeDialog();
              Swal.fire({
                  title: "Error!",
                  text: "Task is failed. Try again later!! ",
                  icon: "succeserrors"
              }).then(() => window.location.reload());
          }


        data=console.log(rate);
        // Swal.fire({
        // icon: 'success',
        // title: 'Success!',
        // text: 'Exel file is received.',
        // onClose: () => {
        //     location.reload();
        //     }
        // });
    }
}