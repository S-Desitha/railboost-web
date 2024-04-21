const endpoint2="forgetPW"
async function createNewPW() {
    user = {};
  
    // Retrieve the tempUID from the URL
    let urlParams = new URLSearchParams(window.location.search);
    let tempUID = urlParams.get("tempUID");
  
    let pw = document.getElementById("password").value;
    let cpw = document.getElementById("cpassword").value;
  
    if (pw === cpw) {
      user["tempUID"] = tempUID;
      user["password"] = pw;
  
      const body = user;
      const params = {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(body),
        method: "POST",
        credentials: "include",
      };
  
      let qparams = { view: 1 };
      let queryString = Object.keys(qparams).map(key => key + '=' + encodeURIComponent(qparams[key])).join('&');
      let urlQuery = `${endpoint2}?${queryString}`;
  
      try {
        let data = await customFetch(urlQuery, params, false);
        console.log(data);
        Swal.fire({
            title: "Password is changed. You can login to the system using your new password.",
            icon: "success",
          }).then(() => {
            window.location.replace("/html/signin.html");
          });
      } catch (error) {
        if (error === "login-redirected") {
          localStorage.setItem("last_url", window.location.pathname);
        }
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error changing the password. Please try again.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Passwords do not match.",
      });
    }
  }