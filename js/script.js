// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function () {

   
        // const counters1 = document.querySelectorAll('.count');
      
        // function startCounter(counter) {
        //   const target = parseInt(counter.getAttribute('data-target'));
        //   const increment = target / 50;
      
        //   let currentValue = 0;
      
        //   function updateCounter() {
        //     currentValue += increment;
        //     counter.textContent = Math.floor(currentValue);
      
        //     if (currentValue < target) {
        //       requestAnimationFrame(updateCounter);
        //     } else {
        //       counter.textContent = target;
        //     }
        //   }
      
        //   updateCounter();
        // }
      
        // counters1.forEach(startCounter);
      
        // const bellIcon = document.getElementById('bell-notification');
    //     const notificationBar = document.getElementById('notification-bar');
    //   console.log("bellIcon",bellIcon);
    //     bellIcon.addEventListener('click', function () {
    //         notificationBar.classList.remove('none');
    //         notificationBar.classList.add('block');

    //     });

         //   make display none removed when the bell icon is clicked
        

      
      
    
    const parcelItems = document.querySelectorAll('.parcel-list li');

    parcelItems.forEach(item => {
        const parcelCount = parseInt(item.querySelector('.No-of-parcels h4').innerText);
        console.log(parcelCount);
        // Check if parcel count is more than 10
        if (parcelCount > 10) {
            item.classList.add('high-parcels');
        }
    });
    // Get all elements with the class 'count'
    const counters = document.querySelectorAll('.count');
    

    // Function to start the counter animation
    function startCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 50; // Increment value for smooth animation

        // Initial value
        let currentValue = 0;

        // Function to update the counter value
        function updateCounter() {
            currentValue += increment;

            // Check if the counter is for revenue
            if (counter.classList.contains('revenue')) {
                // Format the current value with "$" sign and commas
                counter.textContent = 'Rs ' + formatNumber(Math.floor(currentValue));
            } else {
                // For other counters, just display the value
                counter.textContent = Math.floor(currentValue);
            }

            // Stop the animation when the target is reached
            if (currentValue < target) {
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure the final value is exact
                if (counter.classList.contains('revenue')) {
                    counter.textContent = 'Rs ' + formatNumber(target);
                } else {
                    counter.textContent = target;
                }
            }
        }

        // Start the counter animation
        updateCounter();
    }

    // Format a number with commas
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Start the counter animation for each element with the class 'count'
    counters.forEach(startCounter);

    
        const chartCanvas = document.querySelector(".chart");
    
        // Check if the canvas element exists
        if (!chartCanvas) {
            console.error("Canvas element with class 'chart' not found.");
            return;
        }
    
        const chart = new Chart(chartCanvas.getContext("2d"), {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        label: "Revenue by Tickets",
                        data: [250000, 150000, 180000, 400000, 220000, 250000, 200000, 500000, 270000, 240000, 210000, 700000],
                        backgroundColor: "rgba(82, 113, 255, 0.2)",
                        borderColor: "rgba(82, 113, 255, 1)",
                        borderWidth: 2,
                        pointRadius: 5,
                        pointStyle: 'circle'
                    },
                    {
                        label: "Revenue by Parcel Delivery",
                        data: [80000, 90000, 100000, 300000, 120000, 130000, 350000, 150000, 140000, 130000, 600000, 650000],
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 2,
                        pointRadius: 5,
                        pointStyle: 'rect'
                    }
                    // Add more datasets if needed
                ]
            },
            options: {
                responsive: true,
    plugins: {
        tooltip: {
            mode: 'index',
            intersect: false,
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Month',
                font: {
                    size: 20,
                    weight: 'bold'
                }
            }
        },
        y: {
            title: {
                display: true,
                text: 'Revenue (in thousands)',
                font: {
                    size: 20,
                    weight: 'bold'
                }
            }
        }
    }
            }
        });
    
        // Your other JavaScript code...
        
        const DchartCanvas = document.querySelector(".donut-chart");
        const dchart = new Chart(DchartCanvas.getContext("2d"), {
            type: 'doughnut',
            data: {
            labels: [
              'Delayed',
              'On-Time',
              'Cancelled'
            ],
            datasets: [{
              label: 'Punctuality Rate of Trains',
              data: [50, 80, 20],
              backgroundColor: [
                '#5271FF',   // Primary Color (Original Theme Color)
                '#6495ED',   // Secondary Color (Lighter Shade)
                '#3A50B6' 
              ],
              cutout: 100,
              radius: 140,
              borderWidth: 4,
              hoverOffset: 10,
              title: 'Punctuality Rate of Trains'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Punctuality Rate of Trains Today',
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                }
            },
            
        }
          
        });

        
});





$(window).on("pageshow", function() {
    // Your jQuery code here
    $(".menu > ul > li").click(function(e) {
        // remove actiive from alreay active li
        $(this).siblings().removeClass("active");
        // add active to clicked li
        $(this).toggleClass("active");
        // if has sub menu open it
        $(this).find("ul").slideToggle();
        // close all other sub menus if open
        $(this).siblings().find("ul").slideUp();
        // remove active click of submenus
        $(this).siblings().find("ul").find("li").removeClass("active");
    });
    
    $(".menu-btn").click(function() {
        $(".sidebar").toggleClass("active");
    }); 
});


async function customFetch(endpoint, options, sendJWT) {
    let url = "http://localhost:8080/railboost_backend_war_exploded/";
    // const frontendPort = window.location.port;

// Log the detected frontend port
// console.log("Frontend Port:", frontendPort);
    
    if (endpoint!="login" && sendJWT!=false){
        options.headers = {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        };
    }

    url = url+endpoint;

    try {
        let resp = await fetch(url, options);
        if (resp.ok){
            try {
                return await resp.json();
            } catch (e) {
                return {status: resp.status};
            }
        }
        else{
            console.log("Invalid response");
            console.log(resp);
            if (resp.status==401) {
                let msg = await resp.text();
                if (msg=="expired") {
                    window.alert("Session expired. Please login again.");
                    window.location.href="/html/signin.html";
                    return Promise.reject("login-redirected");
                }
            }
            else{
                console.log("Invalid response");
                console.log(resp);
                if (resp.status==401) {
                    let msg = await resp.text();
                    if (msg=="expired") {
                        window.alert("Session expired. Please login again.");
                        window.location.href="/html/signin.html";
                        return Promise.reject("login-redirected");
                    }
                }
                else if (resp.status==400) {
                    let data = await resp.json();
                    let error_msg = data.detailMessage;
                    if (error_msg=="signup-expired"){
                        window.alert("You signup session has expired. Please contact administrator and signup again.");
                    }
                    window.location.href="/index.html";
                    return Promise.reject(data.detailMessage);
                }
                return {
                    isSuccessful: false,
                    status: resp.status
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}



function createNavBar(context) {
    fetch("/html/navbar.html")
        .then(response => response.text())
        .then(data => {
            
            // console.log(data);
            document.getElementsByClassName("navbar")[0].innerHTML = data;
            const loginStatus=localStorage.getItem("loggedIn");
            const Name=localStorage.getItem("name");
            if (loginStatus=="true"){
                document.getElementById("navb").innerHTML= Name;
                
            }
            else{
                localStorage.setItem("loggedIn", false);
                console.log("Logged in status set to null" + localStorage.getItem("loggedIn"));

            }
            // clear local storage

            // console.log("Name: "+Name);
            // console.log(document.getElementById("navb").innerHTML);
            // document.getElementById("navb").innerHTML= Name;
            // //remove cursor events
           

            document.getElementById("navb").style.pointerEvents = "none";
            
            if (context == "admin") {
                document.getElementById("sm-nav").remove();
                document.getElementById("passenger-nav").remove();
                
                document.getElementById("nav-about").remove();
                document.getElementById("nav-contact").remove();
                document.getElementById("nav-services").innerHTML = "Admin Services";
            }
            else if (context == "sm") {
                document.getElementById("admin-nav").remove();
                document.getElementById("passenger-nav").remove();

                document.getElementById("nav-about").remove();
                document.getElementById("nav-contact").remove();
                document.getElementById("nav-services").innerHTML = "SM Services";
            }
            else if (context == "passenger") {
                // document.getElementById("admin-nav").remove();
                // document.getElementById("sm-nav").remove();
            }
        });
}

function createSideBar(context) {
    fetch("/html/sidebar.html")
        .then(response => response.text())
        .then(data => {
            // console.log(data);
            document.getElementsByClassName("sidebar")[0].innerHTML = data;
            const Name=localStorage.getItem("name");
            console.log(Name);
         document.getElementById("name").innerHTML=Name;
            if (context == "admin") {
                document.getElementById("sm-sidebar").remove();
                document.getElementById("passenger-sidebar").remove();

                // document.getElementById("nav-about").remove();
                // document.getElementById("nav-contact").remove();
                document.getElementById("sidebar-services-text-span").innerHTML = "Admin Services";
            }
            else if (context == "sm") {
                // console.log("CONTEXT IDENTIFIED AS SM");
                document.getElementById("admin-sidebar").remove();
                document.getElementById("passenger-sidebar").remove();
                
                document.getElementById("title").innerHTML = "Station Master";
                
                document.getElementById("sidebar-services-text-span").innerHTML = "Station Master Services";
            }
            else if (context == "passenger") {
                document.getElementById("sm-sidebar").remove();
                document.getElementById("admin-sidebar").remove();
                document.getElementById("title").innerHTML = "Passenger";
                
                document.getElementById("sidebar-services-text-span").innerHTML = "Services";
            }
        });
}


function signout() {
    Swal.fire({
        title: 'Are you sure you want to log out?',
        text: 'You will be redirected to the login page.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            // localStorage.setItem("loggedIn", false);
            var currentPort = window.location.port; 
            window.location.replace("/html/signin.html");; // Construct the URL
        }
    });
}
function togglePW() {
    const passwordField = document.getElementById("password");
    const eyeIcon = document.getElementById("password-toggle");

    

    // Toggle password visibility
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
}

function toggleEye() {
    const passwordField = document.getElementById("password");
    const eyeIcon = document.getElementById("password-toggle");

    // Toggle eye icon visibility based on the input field value
    if (passwordField.value.length > 0) {
        eyeIcon.style.display = 'inline-block';
    } else {
        eyeIcon.style.display = 'none';
    }
}
function closeDialog() {
    const openDialogs = document.querySelectorAll('dialog[open]');
    openDialogs.forEach(dialog => {
        dialog.close();
    });
}







function popupAddPage(classname) {
    let dialog = document.querySelector(classname);

    dialog.showModal();

    dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect()
        if (
            (e.clientX !=0 && e.clientY !=0) &&
            (e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom) 
        ) {
            dialog.close()
        }
    });
}




function seatReserve() {
    var userResponse = confirm("Now you'll be redirected to the official website for seat reservations of Sri Lanka Railways.");
    if (userResponse) {
        window.location.href = "https://seatreservation.railway.gov.lk/"; 
    }
}


function confirmCall() {
    var userResponse = confirm("You can call this phone number only in the following cases.\nOccurring in a train and within a railway premises\n1. A conflict situation\n2. A theaf or related complaint\n3. Smoking, drug or alcohol use\n4. Harassment or other similar conduct\n5. Misuse of railway property");
    if (userResponse) {
        window.location.href = "tel:+94 112 336 614"; 
    }
}


function validateEmail() {
    var emailField = document.getElementById("email-field");

var emailError = document.getElementById("email-error");
    
    if(!emailField.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
        emailError.innerHTML = "Please enter a valid email address";
        return false;
    }
        emailError.innerHTML = "";
        return true;
    

}


function validatePhone(){
    var phoneField=document.getElementById("phone-field");
var phoneError=document.getElementById("phone-error");
    if(!phoneField.value.match(/^\d{10}$/)){
        phoneError.innerHTML = "<div>Please enter a valid phone number</div>";
        return false;
    }
        phoneError.innerHTML = "";
        return true;
}

function validatePassword() {
    var passwordField = document.getElementById("password");
    var confirmPasswordField = document.getElementById("cpassword");
    var passwordError = document.getElementById("password-error");
  
    if (passwordField.value !== confirmPasswordField.value) {
      passwordError.innerHTML = "Passwords do not match";
      return false;
    }
  
    passwordError.innerHTML = "";
    return true;
}

function validateStrPassword() {
    var passwordField = document.getElementById("password");
    var passwordError = document.getElementById("spassword-error");
  
    var passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  
    if (!passwordRegex.test(passwordField.value)) {
      passwordError.innerHTML = "<div>Password must be at least 8 characters long and include at least one </br> uppercase letter, one lowercase letter, one digit, and one special </br> character (!@#$%^&*).</div>";

      return false;
    }
  
    passwordError.innerHTML = "";
    return true;
}
function toggleNotify() {
    console.log("Toggle notification bar");
    var dropdown = document.getElementById("notification-bar");
    if (dropdown.style.display === "none") {
        console.log("Displaying notification bar");
      dropdown.style.display = "block";
    } else {
      dropdown.style.display = "none";
    }
    
  }
  
//   window.onclick = function(event){
//     if (!event.target.matches('.dropbtn')){
//         var dropdown = document.getElementById("drop");
//         dropdown.style.display = "none";
//     }
//   }
  
document.addEventListener('DOMContentLoaded', function() {
    const totalPriceInput = document.getElementById('total-price');
    const totalPriceText = document.getElementById('total-price-text');

    totalPriceInput.addEventListener('input', function() {
        const totalPrice = totalPriceInput.value;
        totalPriceText.textContent = 'Total Price of the Season: ' + totalPrice;
    });
});


  async function customFetch1(endpoint, options, sendJWT) {
    let url = "http://localhost:8080/railboost_backend_war_exploded/";

    if (endpoint !== "login" && sendJWT !== false) {
        options.headers = {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        };
    }

    url = url + endpoint;

    try {
        let resp = await fetch(url, options);
        if (resp.ok) {
            if (resp.headers.get('content-type').includes('image')) {
                return await resp.blob();
            }else if(resp.headers.get('content-type').includes('application/pdf')){
                return await resp.blob();
            } else {
                try {
                    return await resp.json();
                } catch (e) {
                    return {status: resp.status};
                }
            }
        } else {
            console.log("Invalid response");
            console.log(resp);
            if (resp.status === 401) {
                let msg = await resp.text();
                if (msg === "expired") {
                    window.alert("Session expired. Please login again.");
                    window.location.href = "/html/signin.html";
                    return Promise.reject("login-redirected");
                }
            } else if (resp.status === 400) {
                let data = await resp.json();
                let error_msg = data.detailMessage;
                if (error_msg === "signup-expired") {
                    window.alert("Your signup session has expired. Please contact the administrator and sign up again.");
                }
                window.location.href = "/index.html";
                return Promise.reject(data.detailMessage);
            }
            return {
                isSuccessful: false,
                status: resp.status
            };
        }
    } catch (error) {
        console.log(error);
    }
}

const chart=document.querySelector(".chart");
console.log(chart);

const charts=new Chart(chart,{
    type:"line",
    data:{
        labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets:[
            {
            label:"Revenue by Tickets Sold",
            data:[0,100,200,300,400,500,600,700,800,900,1000,1100],
            backgroundColor:"rgba(255,99,132,0.2)",
            borderColor:"rgba(255,99,132,1)",
            borderWidth:1
            },
            {
            label:"Revenue by Parcel Delevery",
            // random data set

            data:[600,300,700,600,400,500,1000,100,800,300,1200,1100],
            backgroundColor:"rgba(255,99,132,0.2)",
            borderColor:"rgba(255,99,132,1)",
            borderWidth:1
            }



    
    ]
    },
    options:{
        responsive:true,
        // scales:{
            // yAxes:[{
            //     ticks:{
            //         beginAtZero:true
            //     }
            // }]
        
    }
})

// Get the width of the dialog modal
const dialogWidth = document.querySelector('.dialog-modal').offsetWidth;

// Get the width of the table header
const headerWidth = document.querySelector('.table_header').offsetWidth;

// Calculate the left margin to center the header
const leftMargin = (dialogWidth - headerWidth) / 2;

// Apply the calculated left margin to the table header
document.querySelector('.table_header').style.marginLeft = leftMargin + 'px';

