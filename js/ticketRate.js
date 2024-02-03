function validateStation(){
  
    let Start=document.getElementById("from").getAttribute("stationCode");
    let End=document.getElementById("to").getAttribute("stationCode");
    let StationError=document.getElementById("station-error");
    if(Start==End){
        StationError.innerHTML = "Both start and end stations can't be same.";
        return false;
    }
        StationError.innerHTML = "";
        return true;
}