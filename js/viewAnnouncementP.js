// const url = "http://localhost:8080/railboost_backend_war_exploded/announcement";
const endpoint = "announcement";
console.log("announcement.js");

document.addEventListener("DOMContentLoaded", async function () {
    const endpoint3 = "announcement"
    let params = {
        view: "2",
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

                div.appendChild(title);
                div.appendChild(date);
                div.appendChild(body);

                container.appendChild(div);
            }
        });
  
    }
    catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
    }
});
