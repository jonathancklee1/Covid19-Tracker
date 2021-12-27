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
const sortBtn = document.querySelector(".sort-btn");
const sortDropdown = document.querySelector(".sort-dropdown");

const nameSortAZ = document.getElementById("sort-name-A-Z");
const nameSortZA = document.getElementById("sort-name-Z-A");
const caseSortAsc = document.getElementById("sort-case-asc");
const caseSortDesc = document.getElementById("sort-case-desc");

nameSortAZ.addEventListener("click", () => {
  sortList("alphaAZ");
});
nameSortZA.addEventListener("click", () => {
  sortList("alphaZA");
});
caseSortAsc.addEventListener("click", () => {
  sortList("caseAsc");
});
caseSortDesc.addEventListener("click", () => {
  sortList("caseDesc");
});

// Sort list of countries based on which sort type is pressed
function sortList(type) {
  let i, switching, li, shouldSwitch;
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    li = countryList.getElementsByTagName("LI");
    // Loop through all list items:
    for (i = 0; i < li.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Check if the next item should
      switch place with the current item: */
      switch (type) {
        case "alphaAZ":
          if (
            li[i].childNodes[1].innerHTML.toLowerCase() >
            li[i + 1].childNodes[1].innerHTML.toLowerCase()
          ) {
            /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
            shouldSwitch = true;
            break;
          }
          break;
        case "alphaZA":
          if (
            li[i].childNodes[1].innerHTML.toLowerCase() <
            li[i + 1].childNodes[1].innerHTML.toLowerCase()
          ) {
            shouldSwitch = true;
            break;
          }
          break;
        case "caseAsc":
          if (
            Number(li[i].childNodes[2].innerHTML) >
            Number(li[i + 1].childNodes[2].innerHTML)
          ) {
            shouldSwitch = true;
            break;
          }
          break;
        case "caseDesc":
          if (
            Number(li[i].childNodes[2].innerHTML) <
            Number(li[i + 1].childNodes[2].innerHTML)
          ) {
            shouldSwitch = true;
            break;
          }
          break;
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
      and mark the switch as done: */
        li[i].parentNode.insertBefore(li[i + 1], li[i]);
        switching = true;
      }
    }
  }
  sortDropdown.classList.remove("active");
}
// Search Country List function
function search() {
  let filter = searchBar.value.toUpperCase();
  let name, txtValue;
  let li = countryList.getElementsByTagName("li");
  for (let i = 0; i < li.length; i++) {
    name = li[i].getElementsByTagName("h2")[0];
    txtValue = name.textContent || name.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
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
        // console.log(data.Countries[i]);
      }
      // Modal Detail
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

// Modal Close Functions
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

closeModalBtn.onclick = () => {
  modal.style.display = "none";
};

sortBtn.addEventListener("click", () => {
  sortDropdown.classList.toggle("active");
});
