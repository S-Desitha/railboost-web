// const url = "http://localhost:8080/railboost_backend_war_exploded/train";
const endpoint = "train";


document.addEventListener("DOMContentLoaded", async function () {
  

  document.getElementById("train-form").reset();

  try {
    let data = await customFetch(endpoint, {});

    data.forEach(train => {
      let editButton = document.createElement("button");
      editButton.classList.add("edit-button");
      editButton.innerHTML = "<i class='fas fa-edit'></i>";
      editButton.setAttribute("train", JSON.stringify(train));
      editButton.onclick = editTrain;

      let deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
      deleteButton.setAttribute("train", JSON.stringify(train));
      deleteButton.onclick = deleteTrain;

      let row = document.getElementById("train_table").insertRow(-1);
      row.insertCell(0).innerHTML = train.trainId;
      row.insertCell(1).innerHTML = train.trainType;
      row.insertCell(2).append(editButton, deleteButton);
    });

  }
  catch(error) {
    if (error=="login-redirected")
        localStorage.setItem("last_url", window.location.pathname);
  }
});



function editTrain() {
  var Iderror = document.getElementById('trainIdError');
  Iderror.innerHTML='';
  const dialogModal = document.querySelector('.dialog-modal');
    dialogModal.showModal();
  train = JSON.parse(this.getAttribute("train"));
  console.log(train);

  const button = document.getElementById("add-train-button");

  document.getElementById("add-train-heading").innerHTML = "Update Train";
  button.innerHTML = "Update";

  let trainIdField = document.getElementById("trainId");
  trainIdField.value = train["trainId"]
  trainIdField.disabled = true;

  document.getElementById("trainType").value = train["trainType"];

  button.setAttribute("train", JSON.stringify(train));
  button.onclick = updateTrain;
}

function updateTrain() {
  const dialogModal = document.querySelector('.dialog-modal');
  dialogModal.close();
  train = {};

  train["trainId"] = document.getElementById("trainId").value;
  train["trainType"] = document.getElementById("trainType").value;

  const body = train;
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
        text: "Train updated successfully!",
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
        text: "An error occurred while updating the train.",
        icon: "error"
      });
      if (error == "login-redirected") {
        localStorage.setItem("last_url", window.location.pathname);
      }
    });
}



function deleteTrain() {
  train = JSON.parse(this.getAttribute("train"));
  console.log(train);

  Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete Train with ID ${train["trainId"]}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5271FF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
  }).then((result) => {
      if (result.isConfirmed) {
          const body = train;
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
                      title: "Train Deleted",
                      text: "The Train has been successfully deleted!",
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


async function addNewTrain() {
  train = {};

  train["trainId"] = document.getElementById("trainId").value;
  train["trainType"] = document.getElementById("trainType").value;

  if (!train["trainId"] || !train["trainType"]) {
    return; 
}
  var Iderror = document.getElementById('trainIdError');
  Iderror.innerHTML='';

  const body = train;
  const params = {
      headers: {
          "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(body),
      method: "POST"
  };
  const response=await customFetch(endpoint, params)
      if (response.isSuccessful) {
        closeDialog();
          Swal.fire({
              title: "Success!",
              text: "New Train has been successfully added!",
              icon: "success"
          }).then(() => window.location.reload());
      }else{
        var Iderror = document.getElementById('trainIdError');
        Iderror.innerHTML='Existing Train ID';
        document.getElementById('trainId').value = '';
      }

  console.log(train);
}




