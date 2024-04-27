const endpoint = "getRevenue";
document.addEventListener("DOMContentLoaded", async function () {
    try{
        let data = await customFetch(endpoint, {});
        var totalTicketRevenue = data.totalTicketRevenue;
        var totalParcelRevenue = data.totalParcelBookingRevenue
        let parcelRevenueList = [];
        parcelRevenueList = data.monthlyParcelRevenueList;
        let ticketrevenueList = data.monthlyTicketRevenueList;
        console.log(parcelRevenueList);

        document.getElementById("ticket-revenue").dataset.target= "#totalTicketRevenue"

    }catch{
        
    }

});