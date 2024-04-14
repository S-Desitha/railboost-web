const endpoint3 = "season"
console.log("Hi from season js")

document.addEventListener("DOMContentLoaded", async function () {
    const endpoint3 = "season"
    let params = {
        view: "3",
    };
    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${endpoint3}?${queryString}`;
    
  
    try {
      let data = await customFetch(urlQuery, {credentials: "include"});
      
      data.forEach(season => {
        if (data.length === 0) {
            document.querySelector(".empty_msg").style.display = "block";
            return;
        }else{
            document.querySelector(".empty_msg").style.display = "none";
            let viewButton = document.createElement("button");
            viewButton.classList.add("view-button");
            viewButton.innerHTML = "<i class='fa-solid fa-eye' title='View Application' style='color:#0047AB'><span>  View</span></i>";
            viewButton.setAttribute("season", JSON.stringify(season));
            viewButton.onclick = viewSeason;
            let n=document.createElement("br");
            let m=document.createElement("br");
            let approveButton = document.createElement("button");
            approveButton.classList.add("approve-button");
            approveButton.innerHTML = "<i title='Approve' ><span>  Approve </span></i>";
            approveButton.setAttribute("season", JSON.stringify(season));
            approveButton.onclick = approveSeason;
    
            let rejectButton = document.createElement("button");
            rejectButton.classList.add("reject-button");
            rejectButton.innerHTML = "<i title='Reject' ><span>  Reject</span></i>";
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

        }

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
    console.log(season);
    // Swal.fire({
    //     title: "Are you want to see the application?",
    //     // text: `You won't be able to revert this!`,
    //     icon: "question",
    //     showCancelButton: true,
    //     confirmButtonColor: "#5271FF",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Yes",
    // }).then((result) => {
    //     if (result.isConfirmed) {
            let params = {
                view: "1",
                fileName: season["fileName"]
            };
            let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
            let urlQuery = `${endpoint3}?${queryString}`;
            console.log(urlQuery);

            customFetch1(urlQuery, {credentials: "include"})
                // .then((response) => response.blob())
                .then((blob) => {
                    if (blob.type && blob.type.includes('image')) {
                        const imageUrl = URL.createObjectURL(blob);
                        console.log("Image URL:", imageUrl);
                        let dialogElement = document.getElementById("ilog");
                        if (!dialogElement) {
                            console.error("Dialog element not found");
                            return;
                        }
                        dialogElement.innerHTML = ""; 
                        const imgElement = document.createElement("img");
                        imgElement.src = imageUrl;
                        
                        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                        const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                        const imageAspectRatio = imgElement.width / imgElement.height;
                        if (screenWidth / screenHeight > imageAspectRatio) {
                            imgElement.style.width = `${screenHeight / 2 * imageAspectRatio}px`;
                            imgElement.style.height = `${screenHeight / 2}px`;
                        } else {
                            imgElement.style.width = `${screenWidth / 2}px`;
                            imgElement.style.height = `${screenWidth / 2 / imageAspectRatio}px`;
                        }
                        // dialogElement.style.width = "auto";
                        // dialogElement.style.height = "auto";
                        dialogElement.appendChild(imgElement);
                        document.body.appendChild(dialogElement);
                        

                        dialogElement.showModal();

                        dialogElement.addEventListener("click", () => {
                            dialogElement.close();
                            URL.revokeObjectURL(imgElement.src);
                        });
                    }else{
                        const pdfUrl = URL.createObjectURL(blob);
                        console.log("PDF URL:", pdfUrl);
                        let dialogElement = document.getElementById("plog");
                        if (!dialogElement) {
                            console.error("Dialog element not found");
                            return;
                        }
                        dialogElement.innerHTML = ""; // Clear previous content
                        const iframe = document.createElement("iframe");
                        iframe.src = pdfUrl;
                        iframe.width = "100%";
                        iframe.height = "100%";
                        dialogElement.style.width = "60%"; 
                        dialogElement.style.height = "80%"; 

                        
                        // const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                        // const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                        // const imageAspectRatio = imgElement.width / imgElement.height;
            
                        // iframe.style.width = `${screenHeight / 2}px`;
                        // iframe.style.height = `${screenHeight / 2}px`;
            

                        dialogElement.appendChild(iframe);
                        document.body.appendChild(dialogElement);
                        

                        dialogElement.showModal();

                        dialogElement.addEventListener("click", () => {
                            dialogElement.close();
                            URL.revokeObjectURL(iframe.src);
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching image:", error);
                    if (error == "login-redirected") {
                        localStorage.setItem("last_url", window.location.pathname);
                    }
                });
        // }
    // });
}
