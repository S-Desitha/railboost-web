// const url = "http://localhost:8080/railboost_backend_war_exploded/staff";
const endpoint2 = "staff";
console.log("staff.js");


document.addEventListener("DOMContentLoaded", async function() {
    document.getElementById("staff_form").reset();
    
    setRoles();

    try {


        let data = await customFetch(endpoint2, {credentials: "include"});

    
        data.forEach(staffMember => {
            let editButton = document.createElement("button");
            editButton.classList.add("edit-button");
            editButton.innerHTML = "<i class='fas fa-edit'></i>";
            editButton.setAttribute("staffMember", JSON.stringify(staffMember));
            editButton.onclick = editStaff;
    
            let deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = "<i class='fas fa-trash-alt'></i>";
            deleteButton.setAttribute("staffMember", JSON.stringify(staffMember));
            deleteButton.onclick = deleteStaff;
    
            let row = document.getElementById("staff_table").insertRow(-1);
            row.insertCell(0).innerHTML = staffMember.staffId;
            row.insertCell(1).innerHTML = staffMember.user.fName + " " + staffMember.user.lName;
            // row.insertCell(2).innerHTML = staffMember.user.username;
            row.insertCell(2).innerHTML = staffMember.user.email;
            row.insertCell(3).innerHTML = staffMember.user.telNo;
            let roleCell = row.insertCell(4);
            roleCell.innerHTML = staffMember.user.role.role;
            roleCell.setAttribute("roleId", staffMember.user.role.roleId);
            row.insertCell(5).innerHTML = staffMember.stationName;
            row.insertCell(6).append(editButton, deleteButton);
    
        });
    } catch(error) {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }
});







function editStaff() {
    
    const dialogModal = document.querySelector('.dialog-modal');
    dialogModal.showModal();
    let member = JSON.parse(this.getAttribute("staffMember"));

    console.log(member);

    const button = document.getElementById("add-staff-button");

    document.getElementById("add-staff-heading").innerHTML = "Update Staff Details";
    button.innerHTML = "Update";

    document.getElementById('staffId').value = member["staffId"];
    document.getElementById('staffId').disabled = true;
    document.getElementById('fName').value = member.user["fName"];
    document.getElementById('lName').value = member.user["lName"];
    // document.getElementById('role').value = member.user["role"]=="sm"? "SM" : "TCO";
    document.getElementById('role').value = member.user.role.roleId;
    document.getElementById('role').dispatchEvent(new Event("change"));
    document.getElementById("rst-edit").innerHTML = member["stationName"];
    const ST = document.getElementById('railwayStation');
    ST.setAttribute('stationcode',  member["station"]);
    ST.setAttribute('stationcode',  member["stationName"]);
    // document.getElementById('railwayStation').innerHTML = member["station"];
    document.getElementById('email-field').value = member.user["email"];
    document.getElementById('phone-field').value = member.user["telNo"]
    document.getElementById('username').value = member.user["username"];
    document.getElementById('fName').disabled = true;
    document.getElementById('lName').disabled = true;
    document.getElementById('email-field').disabled = true;
    document.getElementById('phone-field').disabled = true;
    document.getElementById('username').disabled = true;
    document.getElementById('role').disabled=true;

    button.setAttribute("member", JSON.stringify(member));
    button.onclick = updateStaff;
}



function updateStaff() {
    const dialogModal = document.querySelector('.dialog-modal');
    dialogModal.close();
    // staffMember = {user: {}};
    staffMember = {
        user: {
            role: {}
        }
    };

    staffMember["staffId"] = document.getElementById('staffId').value;
    staffMember["station"] = document.getElementById("railwayStation").getAttribute("stationCode");
    staffMember.user.role["roleId"] = document.getElementById("role").value;
    // staffMember.user["email"] = document.getElementById('email-field').value;
    // staffMember.user["telNo"] = document.getElementById('phone-field').value;
    // staffMember.user["username"] = document.getElementById('username').value;
    console.log(staffMember);

    const body = staffMember;
    const params = {
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        },
        body : JSON.stringify(body),
        method : "PUT"
    };


    customFetch(endpoint2, params)
        .then(() => window.location.reload())
        .catch ((error) => {
            if (error=="login-redirected")
                localStorage.setItem("last_url", window.location.pathname);
        });


    console.log(staffMember);
}





function updateUsername() {
    
    const staffId = document.getElementById('staffId').value;
    const firstname = document.getElementById('fName').value;
    const lastname = document.getElementById('lName').value;
    const role = document.getElementById('role').value;
    // const railwayStation = document.getElementById('railwayStation').value;

    
    const lastInitial = lastname.charAt(0).toUpperCase();

    const usernamePrefix = role; // Use the selected role as the username prefix

    const username = usernamePrefix + staffId + firstname + lastInitial ;
    document.getElementById('username').value = username;
    
}



// function popupAddPage() {
//     let dialog = document.querySelector(".staff-add-modal");

//     dialog.showModal();

//     dialog.addEventListener("click", e => {
//         const dialogDimensions = dialog.getBoundingClientRect()
//         if (
//             (e.clientX !=0 && e.clientY !=0) &&
//             (e.clientX < dialogDimensions.left ||
//             e.clientX > dialogDimensions.right ||
//             e.clientY < dialogDimensions.top ||
//             e.clientY > dialogDimensions.bottom) 
//         ) {
//             dialog.close()
//         }
//     });
// }




async function addStaff() {
    staffMember = {
        user: {
            role: {}
        }
    };

    const email = document.getElementById('email-field').value;
    const telephone = document.getElementById('phone-field').value;
    const username = document.getElementById('username').value;

    staffMember["staffId"] = document.getElementById('staffId').value;
    staffMember["station"] = document.getElementById("railwayStation").getAttribute("stationCode");
    staffMember.user["fName"] = document.getElementById("fName").value;
    staffMember.user["lName"] = document.getElementById("lName").value;
    staffMember.user.role["roleId"] = document.getElementById("role").value;
    staffMember.user["email"] = email;
    staffMember.user["telNo"] = telephone;
    staffMember.user["isStaff"] = true;
    staffMember.user["username"] = document.getElementById("username").value;

    if (!staffMember["staffId"] || !staffMember["station"] || !staffMember.user["fName"] || !staffMember.user["lName"] || !staffMember.user.role["roleId"] || !staffMember.user["email"] || !staffMember.user["telNo"]) {
        return; // Prevent form submission
    }

    console.log(staffMember);
    var Iderror = document.getElementById('staffIDError');
    Iderror.innerHTML='';

    const body = staffMember;
    const params = {
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(body),
        method: "POST"
    };    
      
    try {
        const response = await customFetch(endpoint2, params);
        if (response.uid) {
            closeDialog();
            Swal.fire({
                title: "Success!",
                text: `Link to create a password for the Username: ${username} has been sent to the email: ${email}.`,
                icon: "success",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        } else {
            var Iderror = document.getElementById('staffIDError');
            Iderror.innerHTML='Existing Staff ID';
            document.getElementById('staffId').value = '';
        }
    } catch (error) {
        console.error('Error adding staff member:', error);
        Swal.fire({
            title: "Error!",
            text: "An error occurred while adding the staff member.",
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK"
        });
    }
}




async function setRoles() {
    let rolesEndpoint = "roles";

    document.getElementById("role")
        .addEventListener("change", (e) => {
            if (e.target.value == 4) {
                document.getElementById("railwayStation").style.display = "none";
            }
            else
            document.getElementById("railwayStation").style.display = "block";
        });


    try {
        
        let data = await customFetch(rolesEndpoint, {});
        let roleParent = document.getElementById("role");
        
        for (role of data) {
            
            if (role.roleId !== 5) { // Skip appending passenger
                let option = document.createElement("option");
                option.innerHTML = role.role;
                option.value = role.roleId;
                roleParent.appendChild(option);
            }
        }
    }
    catch(error) {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }

}


function toggleFilterBox() {
    var filterBox = document.getElementById('filter-box');
    var filterIcon = document.querySelector('.filter');
    
    // Calculate the position of the filter icon
    var rect = filterIcon.getBoundingClientRect();
    var top = rect.bottom + window.scrollY;
    console.log('Apply Filters');
    
    // Set the left position to be to the left of the filter icon
    var right = window.innerWidth - rect.left - window.scrollX;

    filterBox.style.top = top + 12 + 'px';
    filterBox.style.right = right - 20+  'px';
    filterBox.style.display = (filterBox.style.display === 'block') ? 'none' : 'block';
}


function applyFilters() {
    // Implement the logic to filter by role and railway station
    // var selectedRole = document.getElementById('filter-role').value;
    // var selectedStation = document.getElementById('filter-station').value;

    // Perform filtering logic using selectedRole and selectedStation
    // Update the staff table accordingly

    // After applying filters, hide the filter box
    
    var filterBox = document.getElementById('filter-box');
        filterBox.style.display = 'none';
}

function deleteStaff() {
    member = JSON.parse(this.getAttribute("staffMember"));
    console.log(member);
  
    Swal.fire({
        title: "Are you sure?",
        text: `Are you sure you want to delete Staff Member ${member.user["fName"]}  ${member.user["lName"]}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5271FF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
        if (result.isConfirmed) {
            const body = member;
            const params = {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(body),
                method: "DELETE",
            };
  
            const res=await customFetch(endpoint2, params)
            
                .then((res) => {
                    console.log(res);
                Swal.fire({
                  title: "Staff Member Deleted",
                  text: "The Staff Member has been successfully deleted!",
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
function validateStaffId() {
    const staffIdInput = document.getElementById('staffId');
    const staffIdError = document.getElementById('staffIDError');
    const staffId = staffIdInput.value.trim();

    if (/^0+$/.test(staffId)) {
        staffIdError.textContent = 'Staff ID cannot consist of only zeros';
        return;
    }else{
        staffIdError.textContent = '';
        return;
    }
}