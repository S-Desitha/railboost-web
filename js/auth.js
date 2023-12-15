// window.stop()

authorize(window.location.pathname);

function manageAccess(resp, resource) {
    if (resource!=resp["role"]) {
        alert("Unauthorized Access");
        window.location.replace("/html/forbidden.html");
    }
}



function authorize(pageUrl){
    const url = "http://localhost:8080/railboost_backend_war_exploded/auth";
    console.log("Authorizing User");
    resource = pageUrl.split("/")[2]
    console.log(resource);
    if (resource=="admin" || resource=="sm" || resource=="tco") {
        fetch(url, {
            credentials : "include"
        })
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(json => {
                            console.log(json)
                            manageAccess(json, resource);
                        })
                }
            })
    }
}