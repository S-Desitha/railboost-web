// const url = "http://localhost:8080/railboost_backend_war_exploded/stations";
const Sendpoint = "stations";
console.log("stations.js");



// document.addEventListener("DOMContentLoaded", async function () {
  

//     document.getElementById("station-form").reset();
//     setLines();
  
//     try {
//       let data = await customFetch(endpoint, {});
//       console.log(data);
//       data.forEach(station => {
//         let editButton = document.createElement("button");
//         editButton.classList.add("edit-button");
//         editButton.innerHTML = "<i class='fas fa-edit'></i>";
//         editButton.setAttribute("station", JSON.stringify(station));
//         editButton.onclick = editStation;
//           // console.log("editButton");
//         let deleteButton = document.createElement("button");
//         deleteButton.classList.add("delete-button");
//         deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
//         deleteButton.setAttribute("station", JSON.stringify(station));
//         deleteButton.onclick = deleteStation;
//       // console.log("deleteButton");
  
//         let row = document.getElementById("station_table").insertRow(-1);
//         row.insertCell(0).innerHTML = station.stationCode;
//         row.insertCell(1).innerHTML = station.stationName;
//         // row.insertCell(2).innerHTML = station.address;
//         row.insertCell(2).innerHTML = station.line;
//         row.insertCell(3).innerHTML = station.prevStationName;
//         row.insertCell(4).innerHTML = station.nextStationName;
//         row.insertCell(5).innerHTML = station.contactNo;
//         row.insertCell(6).append(editButton, deleteButton);
//       });
  
//     }
//     catch(error) {
//       if (error=="login-redirected")
//           localStorage.setItem("last_url", window.location.pathname);
//     }
//   });
  // const url = "http://localhost:8080/railboost_backend_war_exploded/stations";
// const endpoint = "stations";
// console.log("stations.js");

const rowsPerPage = 10;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", async function () {
  document.getElementById("station-form").reset();
  setLines();

  try {
    const data = await getSStations(rowsPerPage, (currentPage - 1) * rowsPerPage);
    populateTable(data);
  } catch (error) {
    if (error == "login-redirected") {
      localStorage.setItem("last_url", window.location.pathname);
    }
  }
});

async function getSStations(limit, offset) {
  
  let params = {
    limit: limit,
    offset: offset,
  };
  let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
  let urlQuery = `${endpoint}?${queryString}`;

  const data = await customFetch(urlQuery, {credentials: "include"});
  console.log("Response from backend:", data);
  updatePaginationButtons(currentPage);
  return data;
}

function populateTable(stations) {
  const tableBody = document.getElementById("station_table");
  tableBody.innerHTML = "";

  stations.forEach((station) => {
    let editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.innerHTML = "<i class='fas fa-edit'></i>";
    editButton.setAttribute("station", JSON.stringify(station));
    editButton.onclick = editStation;

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
    deleteButton.setAttribute("station", JSON.stringify(station));
    deleteButton.onclick = deleteStation;

    let row = tableBody.insertRow(-1);
    row.insertCell(0).innerHTML = station.stationCode;
    row.insertCell(1).innerHTML = station.stationName;
    row.insertCell(2).innerHTML = station.line;
    row.insertCell(3).innerHTML = station.prevStationName;
    row.insertCell(4).innerHTML = station.nextStationName;
    row.insertCell(5).innerHTML = station.contactNo;
    row.insertCell(6).append(editButton, deleteButton);
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
    getSStations(rowsPerPage, (currentPage - 1) * rowsPerPage)
      .then(populateTable)
      .catch((error) => {
        if (error == "login-redirected") {
          localStorage.setItem("last_url", window.location.pathname);
        }
      });
}

function goToNextPage() {
    currentPage++;
    getSStations(rowsPerPage, (currentPage - 1) * rowsPerPage)
      .then(populateTable)
      .catch((error) => {
        if (error == "login-redirected") {
          localStorage.setItem("last_url", window.location.pathname);
        }
      });
}
  
  
  function editStation() {
    const dialogModal = document.querySelector('.dialog-modal');
      dialogModal.showModal();
    station = JSON.parse(this.getAttribute("station"));
    console.log(station);
  
    const button = document.getElementById("add-station-button");
  
    document.getElementById("add-station-heading").innerHTML = "Update Station";
    button.innerHTML = "Update";
  
    let stationIdField = document.getElementById("stationId");
    stationIdField.value = station["stationCode"]
    stationIdField.disabled = true;
  stationIdField.setAttribute("title", "Station Code");
  
    //diable station-name field
      let stationNameField = document.getElementById("stationName");
      stationNameField.value = station["stationName"];
      stationNameField.disabled = true;
      stationNameField.setAttribute("title", "Station Name");
  
      //diable address field
      let addressField = document.getElementById("address");
      addressField.value = station["address"];
      addressField.disabled = true;
      addressField.setAttribute("title", "Address");
  
      // disable line field
      let lineField = document.getElementById("selectLine");
      lineField.value = station["line"];
      lineField.disabled = true;
      lineField.setAttribute("title", "Line");
  
      // remove the next station field and prev station field
      document.getElementById("PrevStation").remove();
      document.getElementById("NextStation").remove();
  
  
    document.getElementById("contactNumber").value = station["contactNo"];
  
    button.setAttribute("station", JSON.stringify(station));
   button.onclick = updateStation;
  }
  
  function updateStation() {
    const dialogModal = document.querySelector('.dialog-modal');
    dialogModal.close();
    station = {};
  
    station["contactNo"] = document.getElementById("contactNumber").value;
    station["stationCode"] = document.getElementById("stationId").value;
  
    const body = station;
    const params = {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(body),
      method: "PUT"
    };
  
    customFetch(endpoint, params)
      .then(() => {
        // SweetAlert for success
        Swal.fire({
          title: "Success!",
          text: "Station updated successfully!",
          icon: "success"
        }).then(() => {
          // Reload the page after the user clicks OK
          window.location.reload();
        });
      })
      .catch((error) => {
        // SweetAlert for error
        Swal.fire({
          title: "Error!",
          text: "An error occurred while updating the station.",
          icon: "error"
        });
        if (error == "login-redirected") {
          localStorage.setItem("last_url", window.location.pathname);
        }
      });
  }
  
  
  
  function deleteStation() {
    station = JSON.parse(this.getAttribute("station"));
    console.log(station);
  
    Swal.fire({
        title: "Are you sure?",
        text: `Are you sure you want to delete Station ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5271FF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
            const body = station;
            const params = {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(body),
                method: "DELETE",
            };
  
            customFetch(endpoint, params)
                .then(() => {
                    Swal.fire({
                        title: "Station Deleted",
                        text: "The Station has been successfully deleted!",
                        icon: "success",
                    }).then((result) => {
                        if (result.isConfirmed) window.location.reload();
                    });
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
  
  
  async function addNewStation() {
  
    // first of all clear the form
    // document.getElementById("station-form").reset();
    station = {};
  
    station["stationCode"] = document.getElementById("stationId").value;
    station["stationName"] = document.getElementById("stationName").value;
    station["address"] = document.getElementById("address").value;
    station["line"] = document.getElementById("selectLine").value;
    station["prevStation"] = document.getElementById("PrevStation").value;
    station["nextStation"] = document.getElementById("NextStation").value;
    station["contactNo"] = document.getElementById("contactNumber").value;

    if (!station["stationCode"] || !station["stationName"] || !station["address"] || !station["line"]|| !station["contactNo"]) {
      return; 
    }
  
    const body = station;
    const params = {
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(body),
        method: "POST"
    };
    closeDialog();
    var res = await customFetch(endpoint, params)
        if(res.isSuccessful) {
            Swal.fire({
                title: "Success!",
                text: "New Station has been successfully added!",
                icon: "success"
            }).then(() => window.location.reload());
        }else{
          console.log(res.error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while adding the Station. Check the provided data again.",
            icon: "error"
        }).then(() => window.location.reload());
          
        }
  
    console.log(station);
  }

  
const wrappers = document.querySelectorAll(".wrapper");

let stations;
getStations();


function updateName(selectedLi) {
    // get closest .wrapper element
    const wrapper = selectedLi.closest(".wrapper");
    const selectBtn = wrapper.querySelector(".select-btn");
    const searchInp = wrapper.querySelector("input");
    searchInp.value = "";

    // Get the station object from the selectedLi
    const selectedStation = stations.find(station => station.stationName === selectedLi.innerText);

    addStation(selectedStation.stationName, wrapper);
    wrapper.classList.remove("active");
    selectBtn.firstElementChild.innerText = selectedStation.stationName;

    wrapper.setAttribute("stationCode", selectedStation.stationCode);
    wrapper.setAttribute("stationName", selectedStation.stationName);
}

function addStation(selectedStation,  wrapper) {
    const options = wrapper.querySelector(".options");
    options.innerHTML = "";
    stations.forEach(station => {
        let isSelected = station == selectedStation ? "selected" : "";
        let li = `<li onclick="updateName(this, \'${station.stationCode}\',\'${station.stationName}\')" class="${isSelected}">${station.stationName}</li>`;
        options.insertAdjacentHTML("beforeend", li);
    });
}


function createList() {
    console.log("created station List");
    wrappers.forEach(wrapper => {
      console.log("wrapper");
    const selectBtn = wrapper.querySelector(".select-btn");
    console.log("selectBtn");
    const searchInp = wrapper.querySelector("input");
    const options = wrapper.querySelector(".options");


    addStation("", wrapper);



    searchInp.addEventListener("keyup", () => {
        let arr = [];
        let searchWord = searchInp.value.toLowerCase();
        arr = stations.filter(station => {
            return station.stationName.toLowerCase().startsWith(searchWord);
        }).map(station => {
            let isSelected = station.stationName == selectBtn.firstElementChild.innerText ? "selected" : "";
            return `<li onclick="updateName(this, \'${station.stationCode}\')" class="${isSelected}">${station.stationName}</li>`;
        }).join("");
        options.innerHTML = arr ? arr : `<p style="margin-top: 10px;">Oops! Station not found</p>`;
    });

    selectBtn.addEventListener("click", () => wrapper.classList.toggle("active"));
    });
    
    
}




async function getStations() {
    try {
        stations = await customFetch(Sendpoint, {}, false);
        createList();
    } catch(error) {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }
}



function showSchedules() {
    let startStation = document.getElementById("from").getAttribute("stationCode");
    let endStation = document.getElementById("to").getAttribute("stationCode");
    let date = new Date(document.getElementById("date").value).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

    if(!startStation || !endStation || !date){
      let Error2=document.getElementById("error2");
      Error2.innerHTML = "Please fill in all required fields."
      return;
    }

    const params = {
        startStation : startStation,
        endStation : endStation,
        date : date
    };

    window.location.href = "/html/passenger/passSch.html?schedule="+encodeURIComponent(JSON.stringify(params));
}

function validatePhoneNo(){
  var contactNumber=document.getElementById("contactNumber");
  var contactNumberError=document.getElementById("contactNumberError");
  if(!contactNumber.value.match(/^\d{10}$/)){
      contactNumberError.innerHTML = "Please enter a valid contact number.";
      return false;
  }
      contactNumberError.innerHTML = "";
      return true;
}


async function setLines() {
  let LEndpoint = "lines";

  // document.getElementById("selectLine")
      // .addEventListener("change", (e) => {
      //     if (e.target.value == 4) {
      //         document.getElementById("railwayStation").style.display = "none";
      //     }
      //     else
      //     document.getElementById("railwayStation").style.display = "block";
      // });


  try {
      
      let data = await customFetch(LEndpoint, {});
      let lineParent = document.getElementById("selectLine");
      
      for (line of data) {
          
              let option = document.createElement("option");
              option.innerHTML = line.lineName;
              option.value = line.lineName;
              lineParent.appendChild(option);
      }
  }
  catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
  }

}

function validateStationCode() {
  const stationCodeInput = document.getElementById('stationId');
  const stationCodeRegex = /^[A-Z]{3}$/;
  const errorSpan = document.getElementById('stcode-error');

  if (!stationCodeRegex.test(stationCodeInput.value.trim())) {
    errorSpan.textContent = 'Station code must be 3 uppercase English letters.';
    return false;
  } else {
    errorSpan.textContent = '';
    return true;
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