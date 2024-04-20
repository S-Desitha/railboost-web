// window.stop()

authorize(window.location.pathname);

function manageAccess(resp, resource) {
    if (!localStorage.getItem("loggedIn") || resp.isSuccessful == false || !((resource == "admin" && resp.role["roleId"] == 1) || (resource == "sm" && resp.role["roleId"] == 3) || (resource == "passenger" && resp.role["roleId"] == 5))) {
        // Using SweetAlert for unauthorized access notification
        Swal.fire({
            icon: 'error',
            title: 'Unauthorized Access',
            text: 'You do not have permission to access this resource.',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.replace("/html/forbidden.html");
            }
        });
    }
}


async function authorize(pageUrl){
    const endpoint = "userCredentials";
    resource = pageUrl.split("/")[2]
    if (resource=="admin" || resource=="sm" || resource=="tco") {
        try {
            let data = await customFetch(endpoint, {})
            manageAccess(data, resource);
        } catch(error) {
            if (error=="login-redirected"){}
                localStorage.setItem("last_url", window.location.pathname);
        }
    }
}