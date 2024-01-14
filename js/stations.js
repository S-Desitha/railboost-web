console.log("Hello");
const url = "http://localhost:8080/railboost_backend_war_exploded/stations";
const endpoint = "stations";

const wrappers = document.querySelectorAll(".wrapper");

//update date with current date as default



// let stations = ["Colombo Fort", "Maradana", "Dematagoda", "Kelaniya", "Wanawasala", "Hunupitiya", "Ederamulla", "Horape", "Ragama Junction", "Walpola", "Batuwaththa", "Bulugahagoda", "Ganemulla", "Yagoda", "Gampaha", "Daraluwa", "Bemmulla", "Magalegoda", "Heendeniya Pattiyagoda",
//  "Veyangoda", "Wadurawa", "Keenawala", "Pallewela", "Ganegoda", "Wijaya Rajadahana", "Meerigama", "Wilwatta", "Botale", "Ambepussa", "Yaththalgoda", "Bujjomuwa", "Alawwa", "Walakumbura", "Polgahawela Junction", "Panaliya", "Tismalpola", "Korossa", "Yatagama", "Rambukkana", "Kadigamuwa",
// "Yatiweldeniya", "Gangoda", "Ihala Kotte", "Bambaragala", "Makehelwala", "Balana", "Weralugolla", "Kadugannawa", "Kotabogolla", "Urapola", "Pilimatalawa", "Barammane", "Kiribathkumbura", "Peradeniya Junction", "Koshinna", "Gelioya", "Polgahaanga", "Weligalla", "Botalapitiya",
// "Gangathilaka", "Kahatapitiya", "Gampola", "Wallahagoda", "Tembiligala", "Warakapitiya", "Ulapane", "Pallegama", "Warakawa", "Nawalapitiya", "Selam", "Hieghtenford", "Inguruoya", "Penrose", "Galboda", "Dekinda", "Wewelthalawa", "Watawala", "Ihala Watawala", "Rozella", "Hatton", 
// "Galkandawatta", "Kotagala", "St. Clair", "Thalawakelle", "Watagoda", "Great Western", "Radella", "Nanu Oya", "Perakumpura", "Ambewela", "Pattipola", "Ohiya", "Idalgashinna", "Glenanore", "Haputale", "Diyatalawa", "Bandarawela", "Kinigama", "Heeloya", "Kitalella", "Ella",
// "Demodara", "Uduwara", "Hali-Ela", "Badulla","Colombo Fort", "Secretariat Halt", "Kompanna Veediya", "Kollupitiya", "Bambalapitiya", "Wellawatte", "Dehiwela", "Mount Lavinia", "Ratmalana", "Angulana", "Lunawa", "Moratuwa", "Koralawella", "Egoda Uyana", "Panadura", "Pinwatte", 
// "Wadduwa", "Train Halt 01", "Kalutara North", "Kalutara South", "Katukurunda", "Payagala North", "Payagala South", "Maggona", "Beruwala", "Hettimulla", "Aluthgama", "Bentota", "Induruwa", "Maha Induruwa", "Kosgoda", "Piyagama", "Ahungalla", "Patagamgoda", "Balapitiya", "Andadola",
// "Kandegoda", "Ambalangoda", "Madampagama", "Akurala", "Kahawe", "Telwatte", "Sinigama", "Hikkaduwa", "Thiranagama", "Kumarakanda", "Dodanduwa", "Rathgama", "Boossa", "Ginthota", "Piyadigama", "Richmond Hill", "Galle", "Katugoda", "Unawatuna", "Talpe", "Habaraduwa", "Koggala", "Kathaluwa",
// "Ahangama", "Midigama", "Kubalgama", "Weligama", "Polwathumodara", "Mirissa", "Kamburugamuwa", "Walgama", "Matara", "Piladuwa", "Weherahena", "Kekandura", "Bambarenda", "Wewurukannala", "Nakulugamuwa", "Beliatta"];


let stations;
getStations();
console.log("Hi");





function updateName(selectedLi, stationCode) {
    
    // get closest .wrapper element
    const wrapper = selectedLi.closest(".wrapper");
    const selectBtn = wrapper.querySelector(".select-btn");
    const searchInp = wrapper.querySelector("input");
    searchInp.value = "";
    addStation(selectedLi.innerText, wrapper);
    wrapper.classList.remove("active");
    selectBtn.firstElementChild.innerText = selectedLi.innerText;

    wrapper.setAttribute("stationCode", stationCode);
}

function addStation(selectedStation,  wrapper) {
    const options = wrapper.querySelector(".options");
    options.innerHTML = "";
    stations.forEach(station => {
        let isSelected = station == selectedStation ? "selected" : "";
        let li = `<li onclick="updateName(this, \' ${station.stationCode} \')" class="${isSelected}">${station.stationName}</li>`;
        options.insertAdjacentHTML("beforeend", li);
    });
}



function swap() {
    // Swap station names between "from" and "to" wrappers
    const fromWrapper = document.getElementById("from");
    const toWrapper = document.getElementById("to");

    const temp = fromWrapper.value;
    fromWrapper.value = toWrapper.value;
    toWrapper.value = temp;

    // Update the station names in the wrappers
    updateNames();
}




function createList() {
    wrappers.forEach(wrapper => {
    const selectBtn = wrapper.querySelector(".select-btn");
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
    console.log("Hellow");
    try {
        stations = await customFetch(endpoint, {}, false);
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

    const params = {
        startStation : startStation,
        endStation : endStation,
        date : date
    };

    window.location.href = "/html/passenger/passSch.html?schedule="+encodeURIComponent(JSON.stringify(params));
}
