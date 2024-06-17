// Function to fetch and display notifications
function fetchNotifications() {
    // Check if the user is logged in
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn || loggedIn !== "true") {
        console.log('User not logged in. Displaying login message.');
        // Display login message
        const notificationBar = document.getElementById('notification-bar');
        notificationBar.innerHTML = `
            <div class="notification-item">
                <p class="notification-message">Please Log in to view your notifications</p>
            </div>
        `;
        return;
    }

    console.log('Fetching notifications line 17...');
    // Make an AJAX request to fetch notifications for the signed-in user
    axios.get('http://localhost:8080/railboost_backend_war_exploded/notifications', {
        params: {
            // GET USERid from local storage
            userId: localStorage.getItem("userId") // Replace 123 with the actual user ID of the signed-in user
        }
    })
    .then(response => {
        console.log('Notifications fetched:', response.data);
        console.log('Displaying notifications with axios...');
        // Clear existing notifications
        const notificationBar = document.getElementById('notification-bar');
        notificationBar.innerHTML = '';

        // Iterate over fetched notifications and add them to the notification bar
        response.data.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.classList.add('notification-item');
            // Assuming notification.timestamp is in the format you provided
            // Extract date and time components from notification.timestamp
            const { date, time } = notification.timestamp;

            // Extract individual components from date and time
            const { year, month, day } = date;
            const { hour, minute, second } = time;

            // Create a new Date object with the extracted components
            const timestamp = new Date(year, month - 1, day, hour, minute, second);

            // Create the notification content using the timestamp
            const notificationContent = `
            <div class="notifycontent">
                <p class="notification-title"><strong>${notification.title}</strong></p>
                <p class="notification-message">${notification.message}</p>
                <span class="notification-time">${timestamp.toLocaleString()}</span>
            </div>
            <div>
                <button class="view-notification" onclick="redirectToPage()">View</button>
            </div>
        `;

        


            // Set the inner HTML of the notification item
            notificationItem.innerHTML = notificationContent;

            notificationBar.appendChild(notificationItem);
        });
    })
    .catch(error => {
        console.error('Error fetching notifications:', error);
    });
}
function redirectToPage() {
    const roleId = localStorage.getItem("roleId");
    let url;
    if (roleId === "5") {
        url = "http://localhost:5500/html/passenger/seasonticket.html";
    } else if (roleId === "3") {
        url = "http://localhost:5500/html/sm/sm-season.html";
    }
    if (url) {
        window.location.href = url;
    }
}

// Call the fetchNotifications function when the page loads
window.addEventListener('load', fetchNotifications);
