// const url = "http://localhost:8080/railboost_backend_war_exploded/train";
const endpoint = "stations";


document.addEventListener("DOMContentLoaded", async function () {
  

  document.getElementById("station-form").reset();

  try {
    let data = await customFetch(endpoint, {});
    console.log(data);
    data.forEach(station => {
      let editButton = document.createElement("button");
      editButton.classList.add("edit-button");
      editButton.innerHTML = "<i class='fas fa-edit'></i>";
      editButton.setAttribute("station", JSON.stringify(station));
      editButton.onclick = editStation;
        // console.log("editButton");
      let deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
      deleteButton.setAttribute("station", JSON.stringify(station));
    //   deleteButton.onclick = deleteStation;
    // console.log("deleteButton");

      let row = document.getElementById("station_table").insertRow(-1);
      row.insertCell(0).innerHTML = station.stationCode;
      row.insertCell(1).innerHTML = station.stationName;
      row.insertCell(2).innerHTML = station.address;
      row.insertCell(3).innerHTML = station.line;
      row.insertCell(4).innerHTML = station.contactNo;
      row.insertCell(5).append(editButton, deleteButton);
    });

  }
  catch(error) {
    if (error=="login-redirected")
        localStorage.setItem("last_url", window.location.pathname);
  }
});



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

  document.getElementById("contactNumber").value = station["contactNo"];

  button.setAttribute("station", JSON.stringify(station));
 button.onclick = updateStation;
}

function updateStation() {
  const dialogModal = document.querySelector('.dialog-modal');
  dialogModal.close();
  station = {};

  station["contactNo"] = document.getElementById("contactNumber").value;

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



// function deleteTrain() {
//   train = JSON.parse(this.getAttribute("train"));
//   console.log(train);

//   Swal.fire({
//       title: "Are you sure?",
//       text: `Are you sure you want to delete Train with ID ${train["trainId"]}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#5271FF",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//   }).then((result) => {
//       if (result.isConfirmed) {
//           const body = train;
//           const params = {
//               headers: {
//                   "Content-type": "application/json; charset=UTF-8",
//               },
//               body: JSON.stringify(body),
//               method: "DELETE",
//           };

//           customFetch(endpoint, params)
//               .then(() => {
//                   Swal.fire({
//                       title: "Train Deleted",
//                       text: "The Train has been successfully deleted!",
//                       icon: "success",
//                   }).then((result) => {
//                       if (result.isConfirmed) window.location.reload();
//                   });
//               })
//               .catch((error) => {
//                   if (error == "login-redirected")
//                       localStorage.setItem("last_url", window.location.pathname);
//               });
//       } else {
//           Swal.fire("Cancelled", "Your operation has been cancelled", "error");
//       }
//   });
// }


function addNewTrain() {
  train = {};

  train["trainId"] = document.getElementById("trainId").value;
  train["trainType"] = document.getElementById("trainType").value;

  const body = train;
  const params = {
      headers: {
          "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(body),
      method: "POST"
  };
  closeDialog();
  customFetch(endpoint, params)
      .then(() => {
          Swal.fire({
              title: "Success!",
              text: "New Train has been successfully added!",
              icon: "success"
          }).then(() => window.location.reload());
      })
      .catch((error) => {
          if (error == "login-redirected") {
              localStorage.setItem("last_url", window.location.pathname);
          }
      });

  console.log(train);
}







// const url = "http://localhost:8080/railboost_backend_war_exploded/staff";





// document.addEventListener("DOMContentLoaded",function(){
//     document.getElementById("station_form").reset();

//     fetch(url,{credentials : "include"})
//         .then(res => {
//             if(res.ok) {
//                 return res.json();   
//             }
//         })



// .then(stations =>{
//     stations.forEach(element => {
//         let editButton = document.createElement("button");
//                 editButton.classList.add("edit-button");
//                 editButton.innerHTML = "<i class='fas fa-edit'></i>";
//                 editButton.setAttribute("staffMember", JSON.stringify(staffMember));
//                 editButton.onclick = editStaff;

//                 let deleteButton = document.createElement("button");
//                 deleteButton.classList.add("delete-button");
//                 deleteButton.innerHTML = "<i class='fas fa-trash-alt'></i>";

//                 let row = document.getElementById("stations_table").insertRow(-1);
//                 row.insertCell(0).innerHTML = element.stationId;
//                 row.insertCell(1).innerHTML = element.stationName;
//                 row.insertCell(2).innerHTML = element.address;
//                 row.insertCell(3).innerHTML = element.line;
//                 row.insertCell(4).innerHTML = element.contactNum;
//                 row.insertCell(5).append(editButton , deleteButton);
        
//         });
//     });

// })


// function updateStation() {
//     element = {station: {}}

//     element["stationId"] = document.getElementById('stationId').value;
//     element["stationName"] = document.getElementById('stationName').value;
//     element["address"] = document.getElementById('address').value;
//     element["stationName"] = document.getElementById('stationName').value;
//     element["stationName"] = document.getElementById('stationName').value;
// }

