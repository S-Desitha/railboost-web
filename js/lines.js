const endpoint = "lines";


document.addEventListener("DOMContentLoaded", async function () {
  

    document.getElementById("line-form").reset();
  
    try {
      let data = await customFetch(endpoint, {});
      console.log(data);
      data.forEach(line => {
        let editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerHTML = "<i class='fa fa-info-circle' aria-hidden='true'></i>";
        editButton.setAttribute("line", JSON.stringify(line));
        editButton.onclick = viewlines;
          // console.log("editButton");
        // let deleteButton = document.createElement("button");
        // deleteButton.classList.add("delete-button");
        // deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
        // deleteButton.setAttribute("line", JSON.stringify(line));
        // deleteButton.onclick = deleteLine;
      // console.log("deleteButton");
  
        let row = document.getElementById("line_table").insertRow(-1);
        // row.insertCell(0).innerHTML = line.lineId;
        row.insertCell(0).innerHTML = line.lineName;
        // row.insertCell(2).innerHTML = line.lineStartStation;
        // row.insertCell(3).innerHTML = line.lineEndStation;
        row.insertCell(1).append(editButton);
      });
  
    }
    catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
    }
  });
  
  function viewlines(){

  }
 
  
  
  function editLine() {
    const dialogModal = document.querySelector('.dialog-modal');
      dialogModal.showModal();
    line = JSON.parse(this.getAttribute("line"));
    console.log(line);
  
    const button = document.getElementById("add-line-button");
  
    document.getElementById("add-line-heading").innerHTML = "Update Line";
    button.innerHTML = "Update";
  
    let lineIdField = document.getElementById("lineId");
    lineIdField.value = line["lineId"]
    lineIdField.disabled = true;
  lineIdField.setAttribute("title", "Line ID");
  
    // disable line name
    let lineNameField = document.getElementById("lineName");
    lineNameField.value = line["lineName"];
    lineNameField.disabled = true;
    lineNameField.setAttribute("title", "Line Name");

    // disable line start station
    let lineStartStationField = document.getElementById("lineStartStation");
    lineStartStationField.value = line["lineStartStation"];
    lineStartStationField.disabled = true;
    lineStartStationField.setAttribute("title", "Line Start Station");

    
    let lineEndStationField = document.getElementById("lineEndStation");
    lineEndStationField.value = line["lineEndStation"];
    lineEndStationField.setAttribute("title", "Line End Station");
    document.getElementById("lineEndStation").value = line["lineEndStation"];
  
    button.setAttribute("line", JSON.stringify(line));
   button.onclick = updateLine;
  }
  
  function updateLine() {
    const dialogModal = document.querySelector('.dialog-modal');
    dialogModal.close();
    line = {};
  
    line["lineId"] = document.getElementById("lineId").value;
    line["lineEndStation"] = document.getElementById("lineEndStation").value;

    const body = line;
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
          text: "Line updated successfully!",
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
          text: "An error occurred while updating the line.",
          icon: "error"
        });
        if (error == "login-redirected") {
          localStorage.setItem("last_url", window.location.pathname);
        }
      });
  }
  
  
  
  function deleteLine() {
    line = JSON.parse(this.getAttribute("line"));
    console.log(line);
  
    Swal.fire({
        title: "Are you sure?",
        text: `Are you sure you want to delete Line ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5271FF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
            const body = line;
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
                        title: "Line Deleted",
                        text: "The Line has been successfully deleted!",
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
  
  
  function addNewLine() {
  
   
    line = {};
  
    // line["lineId"] = document.getElementById("lineId").value;
    line["lineName"] = document.getElementById("lineName").value;
    // line["lineStartStation"] = document.getElementById("lineStartStation").value;
    // line["lineEndStation"] = document.getElementById("lineEndStation").value;

    const body = line;
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
                text: "New Line has been successfully added!",
                icon: "success"
            }).then(() => window.location.reload());
        })
        .catch((error) => {
            if (error == "login-redirected") {
                localStorage.setItem("last_url", window.location.pathname);
            }
        });
  
    console.log(line);
  }
  