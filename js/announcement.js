// const url = "http://localhost:8080/railboost_backend_war_exploded/announcement";
const endpoint = "announcement";
console.log("announcement.js");

document.addEventListener("DOMContentLoaded", async function () {
    const endpoint3 = "announcement"
    let params = {
        view: "1",
    };
    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${endpoint3}?${queryString}`;
    
  
    try {
        let data = await customFetch(urlQuery, {credentials: "include"});
        console.log(data);
        
        data.forEach(announcement=> {
            if (data.length === 0) {
                document.querySelector(".empty_msg").style.display = "block";
                return;
            }else{
                document.querySelector(".empty_msg").style.display = "none";
                const container = document.getElementById("table-container");
    
                const div = document.createElement("div");
                div.classList.add("announcement");

                const title = document.createElement("h3");
                title.textContent = announcement.title;

                const date = document.createElement("h5");
                date.textContent = announcement.date;
                date.style.textAlign = "right";
                date.style.fontWeight = "100";

                const body = document.createElement("p");
                body.textContent = announcement.body;

                const buttons = document.createElement("div");
                buttons.classList.add("buttons");

                const editButton = document.createElement("button");
                editButton.classList.add("edit-button");
                editButton.innerHTML = '<i class="fas fa-edit"></i>';
                editButton.setAttribute("details", JSON.stringify(announcement));
                editButton.onclick = editAnns;

                const deleteButton = document.createElement("button");
                deleteButton.classList.add("delete-button");
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.setAttribute("details", JSON.stringify(announcement));
                deleteButton.onclick = deleteAnns;

                buttons.appendChild(editButton);
                buttons.appendChild(deleteButton);

                div.appendChild(title);
                div.appendChild(date);
                div.appendChild(body);
                div.appendChild(buttons);

                container.appendChild(div);
            }
        });
  
    }
    catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
    }
  });

function addAnns() {
    announcement = {};

    announcement["title"] = document.getElementById("Announcement-title").value.trim();
    announcement["category"] = document.getElementById("category").value.trim();
    announcement["body"] = document.getElementById("Announcement-body").value.trim();
    announcement["date"] = new Date().toLocaleDateString("en-US", {year:"numeric", month:"2-digit", day:"2-digit"})

    if(!announcement["title"] || !announcement["category"] || !announcement["body"] ){
        console.log("fill all fields!");
        return;
    }
    
    console.log(announcement);
    let dialog = document.querySelector('.anns-modal');

    dialog.close();

    const body = announcement;
    const params = {
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(body),
        method: "POST",
        credentials: "include"
    };

    customFetch(endpoint, params)
        // .then(() => {
        //     Swal.fire({
        //         title: "Announcement is created.",
        //         icon: "success",
        //     }).then((result) => {
        //         if (result.isConfirmed) window.location.reload();
            
        //     })
            
        // })
        .catch ((error) => {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
        });
        
    window.location.reload();
    
}

function editAnns(){
    popupAddPage('.edit-modal');
    let announcement = JSON.parse(this.getAttribute("details"));

    document.getElementById('editAnnouncement-title').value = announcement["title"];
    document.getElementById('editcategory').value = announcement["category"];
    document.getElementById('editAnnouncement-body').value = announcement["body"];

    const button = document.getElementById("editform-submit-button");
    button.setAttribute("details", JSON.stringify(announcement));
    button.onclick = updateAnns;

    dialog.close();


}

function updateAnns(){
    let announcement = JSON.parse(this.getAttribute("details"));
    console.log(announcement);

    announcement["title"] = document.getElementById('editAnnouncement-title').value;
    announcement["category"] = document.getElementById('editcategory').value;
    announcement["body"] = document.getElementById('editAnnouncement-body').value;

    if(!announcement["title"] || !announcement["category"] || !announcement["body"] ){
        console.log("fill all fields!");
        return;
    }

    const body = announcement;
    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(body),
        method : "PUT"
    };

    customFetch(endpoint, params)
        .then(() => window.location.reload())
        .catch ((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });


    console.log(announcement);

}

function deleteAnns() {
    announcement = JSON.parse(this.getAttribute("details"));
    
    Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            const body = announcement;
            const params = {
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(body),
            method: "DELETE"
            };
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });

            customFetch(endpoint, params)
                .then(() => {
                    Swal.fire({
                        title: "Announcement is deleted.",
                        icon: "success",
                    }).then((result) => {
                        if (result.isConfirmed) window.location.reload();
                    
                    })
                    
                })
            .catch ((error) => {
                if (error=="login-redirected")
                    localStorage.setItem("last_url", window.location.pathname);
            });
        }else {
            Swal.fire("Cancelled", "Your operation has been cancelled", "error");
        }
    });
}
  