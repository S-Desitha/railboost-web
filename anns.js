document.getElementById("announcement-form").addEventListener("submit", function (e) {
    e.preventDefault();
    
    // Get data from the form fields
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    // Create a new announcement block
    const announcementBlock = document.createElement("div");
    announcementBlock.classList.add("announcement");
    announcementBlock.innerHTML = `<h3>${title}</h3><p>${content}</p>`;

    // Append the announcement block to the list
    document.getElementById("announcements-list").appendChild(announcementBlock);

    // Clear the form fields
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
});

// Example Announcements (you can add more as needed)
const exampleAnnouncements = [
    {
        title: "Important Schedule Change",
        content: "Due to maintenance work, there will be a schedule change on April 5, 2023. Please check the new schedule."
    },
    {
        title: "Safety First",
        content: "Passengers are reminded to follow all safety guidelines while on railway premises. Your safety is our priority."
    },
    {
        title: "New Train Added",
        content: "Exciting news! We've added a new express train for a faster commute. Check out the schedule."
    }
];

// Display example announcements
const announcementsList = document.getElementById("announcements-list");
exampleAnnouncements.forEach(announcement => {
    const announcementBlock = document.createElement("div");
    announcementBlock.classList.add("announcement");
    announcementBlock.innerHTML = `<h3>${announcement.title}</h3><p>${announcement.content}</p>`;
    announcementsList.appendChild(announcementBlock);
});