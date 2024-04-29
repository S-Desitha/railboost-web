const endpoint7 = "getRevenue";
document.addEventListener("DOMContentLoaded", async function () {
    try{
        let data = await customFetch(endpoint7, {});
        var totalTicketRevenue = data.totalTicketRevenue;
        var totalParcelRevenue = data.totalParcelBookingRevenue
        let parcelRevenueList = [];
        parcelRevenueList = data.monthlyParcelRevenueList;
        let ticketrevenueList = data.monthlyTicketRevenueList;
        console.log(parcelRevenueList);
        console.log(ticketrevenueList);
        console.log(totalTicketRevenue);
        console.log(totalParcelRevenue);
        let countElement = document.querySelector('.count revenue');
        countElement.setAttribute('data-target', totalTicketRevenue);

        // document.getElementById("ticket-revenue").dataset.target= "#totalTicketRevenue"

    }catch{
        
    }

});