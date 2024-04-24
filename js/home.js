const endpoint2 = "profile"

document.addEventListener("DOMContentLoaded", async function () {
    // const endpoint3 = "user"
    let params = {
        view: 1,
        userId: localStorage.getItem("userId"),
    };
    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
    let urlQuery = `${endpoint2}?${queryString}`;
    
        let data = await customFetch(urlQuery, {credentials: "include"});
        console.log(data);
        document.querySelector('.homeStation p').textContent=data.homeStation;
        console.log(data.homeStation);

        const endpoint = "trainSchedule";
        let schParams = {
            startStation: data.homeStCode,
            endStation:"FOT",
            date:new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        };
    //    display the schedule
    console.log(schParams);

    let urlQuery2 = endpoint + `?json=${encodeURIComponent(JSON.stringify(schParams))}`;

    

        let schedules = await customFetch(urlQuery2, {}, false);
        console.log(schedules);
        

        // let editButton = document.getElementById("edit-btn");
        // editButton.setAttribute("details", JSON.stringify(data));
        // editButton.onclick = editProfile;

        // document.getElementById("Username").value=data.username;
        // document.getElementById("email").value=data.email;
        // document.getElementById("Fname").value=data.fName + " " +data.lName;
        // document.getElementById("gen").value=data.gender;
        // document.getElementById("homeStation").value=data.homeStation;
        // document.getElementById("tel").value=data.telNo;

        // document.getElementById("name-c2").textContent = data.fName + " " +data.lName;
        // document.getElementById("role-c2").textContent = data.role.role;

        // getdp(data.dp);

    
  });