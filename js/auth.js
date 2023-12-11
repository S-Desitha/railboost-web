// window.stop()
const url = "http://localhost:8080/railboost_backend_war_exploded/auth";

fetch(url, {
    credentials : "include"
})
    .then(response => {
        if (response.ok) {
            response.json()
                .then(json => {
                    console.log(json)
                    manageAccess(json, document.URL);
                })
        }
    })

function manageAccess(rep, url) {
    const arr = url.split('/');
    const endpoint = arr[arr.length-2]
    console.log(endpoint)

    if (endpoint=="admin") {
        if (rep["role"]=="admin") {
            // window.location.replace(url)
        }
        else {
            window.stop()
            window.alert("You don't have permission to access thie page!")
        }
    }
}