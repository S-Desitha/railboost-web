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
        // add data.role.roleId to the local storage
        localStorage.setItem("roleId", data.role.roleId);
        console.log(data.homeStation);
});