let covid_url = `https://api.covid19api.com/summary`;
let countryArray = [];
const countryList = document.querySelector(".country-list");
const countryItem = document.querySelectorAll(".country-item");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-btn");
const countryNameModal = document.getElementById("country-name-modal");
const countryNewCasesModal = document.getElementById("country-new-cases-modal");
const countryTotalCasesModal = document.getElementById(
  "country-total-cases-modal"
);
const countryNewDeathsModal = document.getElementById(
  "country-new-deaths-modal"
);
const countryTotalDeathsModal = document.getElementById(
  "country-total-deaths-modal"
);
const countryFlagModal = document.querySelector(".country-flag-modal");
const searchBar = document.querySelector(".search-bar");

function search() {
  let value = searchBar.value.toUpperCase();
  let name;
  for (let i = 0; i < countryList.length; i++) {
    name = countryItem[i].getElementsByTagName("h2")[0];
    let txtValue = name.textContent || name.innerText;
    if (txtValue.toUpperCase().indexOf(value) > -1) {
      countryItem[i].style.display = "";
    } else {
      countryItem[i].style.display = "none";
    }
  }
}
window.onload = () => {
  fetch(covid_url)
    .then((response) => response.json())
    .then((data) => {
      for (let i in data.Countries) {
        let li = document.createElement("li");
        let h2 = document.createElement("h2");
        let p = document.createElement("p");
        let img = document.createElement("img");
        let countryCode = data.Countries[i].CountryCode;
        h2.appendChild(document.createTextNode(`${data.Countries[i].Country}`));
        h2.setAttribute("class", "country-name");
        p.appendChild(
          document.createTextNode(`+${data.Countries[i].NewConfirmed}`)
        );
        img.src = `https://flagcdn.com/96x72/${countryCode.toLowerCase()}.png`;
        img.setAttribute("class", "country-flag");
        li.appendChild(img);
        li.appendChild(h2);
        li.setAttribute("class", "country-item");
        li.appendChild(p);
        countryList.appendChild(li);
        console.log(data.Countries[i]);
      }
      const countryItem = document.querySelectorAll(".country-item");
      countryItem.forEach((item) => {
        item.addEventListener("click", (e) => {
          // Get clicked country name
          let countryName = e.target.childNodes[1].innerHTML;
          modal.style.display = "block";
          // Change modal content to clicked country
          countryNameModal.innerHTML = `${countryName}`;
          for (let j in data.Countries) {
            if (countryName == data.Countries[j].Country) {
              let countryCodeModal = data.Countries[j].CountryCode;
              countryFlagModal.src = `https://flagcdn.com/256x192/${countryCodeModal.toLowerCase()}.png`;
              countryNewCasesModal.innerHTML = `New Cases: +${data.Countries[j].NewConfirmed}`;
              countryTotalCasesModal.innerHTML = `Total Cases: ${data.Countries[j].TotalConfirmed}`;
              countryNewDeathsModal.innerHTML = `New Deaths: +${data.Countries[j].NewDeaths}`;
              countryTotalDeathsModal.innerHTML = `Total Deaths: ${data.Countries[j].TotalDeaths}`;
            }
          }
        });
      });
    })
    .catch((error) => alert("Cannot retrieve data"));
};

// function getCountryCode() {
//   fetch("https://flagcdn.com/en/codes.json")
//     .then((response) => response.json())
//     .then((data) => {
//       // console.log(data);
//     });
// }
// getCountryCode();

// Modal Close Functions
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

closeModalBtn.onclick = () => {
  modal.style.display = "none";
};
