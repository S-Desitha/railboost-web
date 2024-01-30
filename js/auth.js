// window.stop()

authorize(window.location.pathname);

function manageAccess(resp, resource) {
    if (!((resource=="admin" && resp["roleId"]==1) || (resource=="sm" && resp["roleId"]==3) || (resource=="passenger" && resp["roleId"]==5))) {
        alert("Unauthorized Access");
        window.location.replace("/html/forbidden.html");
    }
}



async function authorize(pageUrl){
    const endpoint = "userCredentials";
    resource = pageUrl.split("/")[2]
    if (resource=="admin" || resource=="sm" || resource=="tco") {
        try {
            let data = await customFetch(endpoint, {})
            manageAccess(data.role, resource);
        } catch(error) {
            if (error=="login-redirected"){}
                localStorage.setItem("last_url", window.location.pathname);
        }
    }
}