const url = "http://localhost:8080/railboost_backend_war_exploded/train";



document.addEventListener("DOMContentLoaded", async function () {
  const endpoint = "train";

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
  train = JSON.parse(this.getAttribute("train"));
  console.log(train);

  const button = document.getElementById("add-new-train-button");

  document.getElementById("add-new-train-header").innerHTML = "Update Train";
  button.innerHTML = "Update";

  let trainIdField = document.getElementById("trainId");
  trainIdField.value = train["trainId"]
  trainIdField.disabled = true;

  document.getElementById("trainType").value = train["trainType"];

  button.setAttribute("train", JSON.stringify(train));
  button.onclick = updateTrain;
}



function deleteTrain() {
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

  fetch(url, params)
    .then(res => {
      if (res.ok) {
        window.location.reload();
      }
    });

  console.log(train);
}



function updateTrain() {
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

  fetch(url, params)
    .then(res => {
      if (res.ok) {
        window.location.reload();
      }
    });

  console.log(train);
}
