const endpoint3 = "season"
console.log("Hi from season js")

document.addEventListener("DOMContentLoaded", async function () {
  const endpoint3 = "season"
  
    
  
    try {
      let data = await customFetch(endpoint3, {});
      
      data.forEach(season => {

        let viewButton = document.createElement("button");
        viewButton.classList.add("view-button");
        viewButton.innerHTML = "<i class='fa-solid fa-eye' title='View Application' style='color:#0047AB'><span>  View</span></i>";
        viewButton.setAttribute("season", JSON.stringify(season));
        viewButton.onclick = viewSeason;

        let approveButton = document.createElement("button");
        approveButton.classList.add("approve-button");
        approveButton.innerHTML = "<i class='fa fa-check' title='Approve' style='color:#228B22'></i>";
        approveButton.setAttribute("season", JSON.stringify(season));
        approveButton.onclick = approveSeason;
  
        let rejectButton = document.createElement("button");
        rejectButton.classList.add("reject-button");
        rejectButton.innerHTML = "<i class='fa fa-times' title='Reject' style='color:red'></i>";
        rejectButton.setAttribute("season", JSON.stringify(season));
        rejectButton.onclick = rejectSeason;        

        
        let row = document.getElementById("season_table").insertRow(0);
        row.insertCell(0).innerHTML = season.id;
        row.insertCell(1).innerHTML = season.passengerType;
        row.insertCell(2).innerHTML = season.endStation;
        row.insertCell(3).innerHTML = season.startDate;
        row.insertCell(4).innerHTML = season.endDate;
        row.insertCell(5).append(viewButton);
        row.insertCell(6).append(approveButton, rejectButton);

      });
  
    }
    catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
    }
  });


function rejectSeason() {
    // season = {};
    season = JSON.parse(this.getAttribute("season"));

    Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5271FF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reject it!",
    }).then((result) => {
        if (result.isConfirmed) {
            season["status"] = "Rejected";
            const body = season;
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
                        title: "Application is Rejected",
                        // text: "The rate has been successfully updated!",
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
            Swal.fire("Cancelled", "Your operation has been cancelled", "error");
            
        }
    });
}

function approveSeason() {
    season = JSON.parse(this.getAttribute("season"));
    console.log(season);
    Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5271FF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, approve it!",
    }).then((result) => {
        if (result.isConfirmed) {
            season["status"] = "Approved";
            const body = season;
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
                        title: "Application is Approved",
                        // text: "The rate has been successfully updated!",
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
            Swal.fire("Cancelled", "Your operation has been cancelled", "error");
            
        }
    });
}


function viewSeason() {
    season = JSON.parse(this.getAttribute("season"));
    Swal.fire({
        title: "Are you want to see the application?",
        // text: `You won't be able to revert this!`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#5271FF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
    }).then((result) => {
        if (result.isConfirmed) {
            let params = {
                view: "1",
                fileName: season["fileName"]
            };
            let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
            let urlQuery = `${endpoint3}?${queryString}`;
          

            customFetch(urlQuery, {credentials: "include"})
                .then((result) => {
                    if (result.isConfirmed) window.location.reload();
                           
            })
                .catch((error) => {
                    if (error == "login-redirected")
                        localStorage.setItem("last_url", window.location.pathname);
                });
        }
    });
}

  
