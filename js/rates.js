document.addEventListener("DOMContentLoaded", async function () {
    const endpoint = "rates";
  
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
  