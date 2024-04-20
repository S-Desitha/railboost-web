function showSelectParcelPage(){
    

    var parcel = JSON.parse(this.getAttribute("parcelSchedule"))
    localStorage.setItem("AddWeightParcels",parcel["bookingId"]);
    console.log(localStorage.getItem("AddWeightParcels"));
    console.log(parcel["bookingId"]);

    window.location.href = "selectParcel.html";
}