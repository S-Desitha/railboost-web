// const url = "http://localhost:8080/railboost_backend_war_exploded/stations";
const Sendpoint = "stations";
console.log("stations.js");
  
const wrappers = document.querySelectorAll(".wrapper");

let stations;
getStations();


function updateName(selectedLi) {
    // get closest .wrapper element
    const wrapper = selectedLi.closest(".wrapper");
    const selectBtn = wrapper.querySelector(".select-btn");
    const searchInp = wrapper.querySelector("input");
    searchInp.value = "";

    // Get the station object from the selectedLi
    const selectedStation = stations.find(station => station.stationName === selectedLi.innerText);

    addStation(selectedStation.stationName, wrapper);
    wrapper.classList.remove("active");
    selectBtn.firstElementChild.innerText = selectedStation.stationName;

    wrapper.setAttribute("stationCode", selectedStation.stationCode);
    wrapper.setAttribute("stationName", selectedStation.stationName);
}

function addStation(selectedStation,  wrapper) {
    const options = wrapper.querySelector(".options");
    options.innerHTML = "";
    stations.forEach(station => {
        let isSelected = station == selectedStation ? "selected" : "";
        let li = `<li onclick="updateName(this, \'${station.stationCode}\',\'${station.stationName}\')" class="${isSelected}">${station.stationName}</li>`;
        options.insertAdjacentHTML("beforeend", li);
    });
}


function createList() {
    console.log("created station List");
    wrappers.forEach(wrapper => {
      console.log("wrapper");
    const selectBtn = wrapper.querySelector(".select-btn");
    console.log("selectBtn");
    const searchInp = wrapper.querySelector("input");
    const options = wrapper.querySelector(".options");


    addStation("", wrapper);



    searchInp.addEventListener("keyup", () => {
        let arr = [];
        let searchWord = searchInp.value.toLowerCase();
        arr = stations.filter(station => {
            return station.stationName.toLowerCase().startsWith(searchWord);
        }).map(station => {
            let isSelected = station.stationName == selectBtn.firstElementChild.innerText ? "selected" : "";
            return `<li onclick="updateName(this, \'${station.stationCode}\')" class="${isSelected}">${station.stationName}</li>`;
        }).join("");
        options.innerHTML = arr ? arr : `<p style="margin-top: 10px;">Oops! Station not found</p>`;
    });

    selectBtn.addEventListener("click", () => wrapper.classList.toggle("active"));
    });
    
    
}




async function getStations() {
    try {
        stations = await customFetch(Sendpoint, {}, false);
        createList();
    } catch(error) {
        if (error=="login-redirected")
            localStorage.setItem("last_url", window.location.pathname);
    }
}



function showSchedules() {
    let startStation = document.getElementById("from").getAttribute("stationCode");
    let endStation = document.getElementById("to").getAttribute("stationCode");
    let date = new Date(document.getElementById("date").value).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

    if(!startStation || !endStation || !date){
      let Error2=document.getElementById("error2");
      Error2.innerHTML = "Please fill in all required fields."
      return;
    }

    const params = {
        startStation : startStation,
        endStation : endStation,
        date : date
    };

    window.location.href = "/html/passenger/passSch.html?schedule="+encodeURIComponent(JSON.stringify(params));
}

function validatePhoneNo(){
  var contactNumber=document.getElementById("contactNumber");
  var contactNumberError=document.getElementById("contactNumberError");
  if(!contactNumber.value.match(/^\d{10}$/)){
      contactNumberError.innerHTML = "Please enter a valid contact number.";
      return false;
  }
      contactNumberError.innerHTML = "";
      return true;
}


async function setLines() {
  let LEndpoint = "lines";

  // document.getElementById("selectLine")
      // .addEventListener("change", (e) => {
      //     if (e.target.value == 4) {
      //         document.getElementById("railwayStation").style.display = "none";
      //     }
      //     else
      //     document.getElementById("railwayStation").style.display = "block";
      // });


  try {
      
      let data = await customFetch(LEndpoint, {});
      let lineParent = document.getElementById("selectLine");
      
      for (line of data) {
          
              let option = document.createElement("option");
              option.innerHTML = line.lineName;
              option.value = line.lineName;
              lineParent.appendChild(option);
      }
  }
  catch(error) {
      if (error=="login-redirected")
          localStorage.setItem("last_url", window.location.pathname);
  }

}

function validateStationCode() {
  const stationCodeInput = document.getElementById('stationId');
  const stationCodeRegex = /^[A-Z]{3}$/;
  const errorSpan = document.getElementById('stcode-error');

  if (!stationCodeRegex.test(stationCodeInput.value.trim())) {
    errorSpan.textContent = 'Station code must be 3 uppercase English letters.';
    return false;
  } else {
    errorSpan.textContent = '';
    return true;
  }
}

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