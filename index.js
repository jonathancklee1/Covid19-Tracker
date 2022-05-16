let covid_url = `https://api.covid19api.com/summary`;
let countryItem = document.querySelectorAll(".country-item");
const countryList = document.querySelector(".country-list");
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
const favCountryBtn = document.querySelector(".favourites-btn");
const favCarousel = document.querySelector(".carousel-track");
const copyright = document.querySelector(".copyright");

const date = document.querySelector(".date-text");
const nameSortAZ = document.getElementById("sort-name-A-Z");
const nameSortZA = document.getElementById("sort-name-Z-A");
const caseSortAsc = document.getElementById("sort-case-asc");
const caseSortDesc = document.getElementById("sort-case-desc");

let noneChecked = true;

let favCountryArray = [];

// Eventlisteners
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

// On Window Load
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  checkIfFavEmpty();

  getData().then((data) => {
    displayCountryList(data);

    countryItem = document.querySelectorAll(".country-item");

    countryItem.forEach((item) => {
      item.addEventListener("click", (e) => {
        displayModal(data, e.currentTarget.childNodes[2].innerHTML);
      });
    });
    displayLS();
  });
  const year = new Date().getFullYear();
  copyright.innerHTML =
    "&copy; " + year + " Jonathan Lee. All rights reserved.";
});

// Display list items in local storage and set new eventListeners
function displayLS() {
  getData().then((data) => {
    favCountryArray = JSON.parse(localStorage.getItem("fav-countries")) || [];

    for (let i in favCountryArray) {
      favCarousel.insertAdjacentHTML("beforeend", favCountryArray[i].content);
      checkIfFavEmpty();
    }
    const favCountryItem = document.querySelectorAll(".fav-country-item");
    favCountryItem.forEach((item) => {
      item.addEventListener("click", (e) => {
        let countryName = e.target.childNodes[2].innerHTML;
        displayModal(data, countryName);
      });

      // Update new cases
      for (let i in data.Countries) {
        if (data.Countries[i].Country == item.childNodes[2].innerHTML)
          item.childNodes[3].innerHTML = `+${data.Countries[i].NewConfirmed}`;
      }

      disableCheckbox(`${item.childNodes[2].innerHTML}`);

      const deleteBtn = document.querySelectorAll(".del-country-btn");
      deleteBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
          btn.parentElement.remove();
          btn.parentElement.childNodes[0].removeAttribute("disabled");
          enableCheckbox(`${item.childNodes[2].innerHTML}`);
          favCountryArray = JSON.parse(localStorage.getItem("fav-countries"));

          favCountryArray = favCountryArray.filter(
            (item) =>
              item.countryName !== btn.parentElement.childNodes[2].innerHTML
          );

          console.log(favCountryArray);

          localStorage.setItem(
            "fav-countries",
            JSON.stringify(favCountryArray)
          );
          checkIfFavEmpty();
        });
      });
    });
  });
}

// Check if favourites container is empty
function checkIfFavEmpty() {
  const favCountryItem = document.querySelector(".fav-country-item");
  const noFavText = document.getElementById("no-fav-text");
  if (favCarousel.contains(favCountryItem)) {
    noFavText.style.display = "none";
  } else {
    noFavText.style.display = "block";
  }
}

// Add selected countries to favourites container
favCountryBtn.addEventListener("click", () => {
  getData().then((data) => {
    const favCountryItem = document.querySelectorAll(".fav-country-item");
    favCountryItem.forEach((item) => {
      item.addEventListener("click", (e) => {
        let favCountryName = e.currentTarget.childNodes[2].innerHTML;
        displayModal(data, favCountryName);
      });
    });
  });
  getChecked();
  noneChecked = true;
  checkIfFavEmpty();
});

// Disables Country List checkbox
function disableCheckbox(country) {
  countryItem = document.querySelectorAll(".country-item");
  countryItem.forEach((item) => {
    if (item.childNodes[2].innerHTML == country) {
      item.childNodes[0].setAttribute("disabled", "true");
      item.childNodes[0].checked = false;
    }
  });
}

// Enables Country List checkbox
function enableCheckbox(country) {
  countryItem = document.querySelectorAll(".country-item");
  countryItem.forEach((item) => {
    if (item.childNodes[2].innerHTML == country) {
      item.childNodes[0].removeAttribute("disabled");
    }
  });
}
// Loop through country list to see checked country
function getChecked() {
  countryItem = document.querySelectorAll(".country-item");
  countryItem.forEach((item) => {
    if (item.childNodes[0].checked) {
      // Clone country li that are checked
      let newLi = item.cloneNode(true);
      let btn = document.createElement("button");
      btn.setAttribute("class", "del-country-btn");
      btn.setAttribute("onclick", "event.stopPropagation()");
      btn.innerHTML = `<i class="fas fa-times"></i>`;
      newLi.setAttribute("class", "fav-country-item");
      newLi.childNodes[2].setAttribute("class", "fav-country-name");
      newLi.childNodes[0].style.visibility = "hidden";
      newLi.appendChild(btn);

      console.log(favCountryArray);
      if (
        !favCountryArray.includes({
          countryName: newLi.childNodes[2].innerHTML,
          content: newLi.outerHTML,
        })
        // favCountryArray.some(
        //   (item) => item.countryName !== newLi.childNodes[2].innerHTML
        // )
      ) {
        favCountryArray.push({
          countryName: newLi.childNodes[2].innerHTML,
          content: newLi.outerHTML,
        });
      }
      console.log(favCountryArray);
      localStorage.setItem("fav-countries", JSON.stringify(favCountryArray));

      favCarousel.appendChild(newLi);
      disableCheckbox(`${newLi.childNodes[2].innerHTML}`);

      noneChecked = false;
      // Add delete button
      btn.addEventListener("click", () => {
        console.log(newLi.childNodes[2].innerHTML);
        favCountryArray = favCountryArray.filter(
          (item) => item.countryName !== newLi.childNodes[2].innerHTML
        );
        console.log(favCountryArray);
        localStorage.setItem("fav-countries", JSON.stringify(favCountryArray));

        btn.parentElement.remove();
        item.childNodes[0].removeAttribute("disabled");

        checkIfFavEmpty();
      });
    }
  });
  if (noneChecked) {
    alert(
      "No Countries Selected! Please select checkbox to add country to favourites."
    );
  }
}

// Retrieve data as json from API
function getData() {
  return new Promise((resolve, reject) => {
    fetch(covid_url)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          resolve(data);
        } else {
          reject("Data is unavailable");
        }
      })
      .catch(() => {
        alert(
          "Data is unavailable now. This may be due to an error in the COVID-19 api. Please try again later!"
        );
      });
  });
}

function displayModal(jData, cName) {
  // Get clicked country name
  modal.style.display = "block";
  // Change modal content to clicked country
  countryNameModal.innerHTML = `${cName}`;
  for (let j in jData.Countries) {
    if (cName == jData.Countries[j].Country) {
      let countryCodeModal = jData.Countries[j].CountryCode;
      countryFlagModal.src = `https://flagcdn.com/256x192/${countryCodeModal.toLowerCase()}.png`;
      countryNewCasesModal.innerHTML = `New Cases: +${jData.Countries[j].NewConfirmed}`;
      countryTotalCasesModal.innerHTML = `Total Cases: ${jData.Countries[j].TotalConfirmed}`;
      countryNewDeathsModal.innerHTML = `New Deaths: +${jData.Countries[j].NewDeaths}`;
      countryTotalDeathsModal.innerHTML = `Total Deaths: ${jData.Countries[j].TotalDeaths}`;
    }
  }
}

// Render list of all countries from data into list format
function displayCountryList(data) {
  console.log(data);
  date.innerHTML = `Updated on ${data.Date.substring(0, 10)}`;
  for (let i in data.Countries) {
    let li = document.createElement("li");
    let h2 = document.createElement("h2");
    let p = document.createElement("p");
    let img = document.createElement("img");
    let checkbox = document.createElement("INPUT");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "country-cb");
    checkbox.setAttribute("onclick", "event.stopPropagation()");
    checkbox.value = `${data.Countries[i].Country}`;
    let countryCode = data.Countries[i].CountryCode;
    h2.appendChild(document.createTextNode(`${data.Countries[i].Country}`));
    h2.setAttribute("class", "country-name");
    p.appendChild(
      document.createTextNode(`+${data.Countries[i].NewConfirmed}`)
    );
    img.src = `https://flagcdn.com/96x72/${countryCode.toLowerCase()}.png`;
    img.setAttribute("class", "country-flag");
    li.appendChild(checkbox);
    li.appendChild(img);
    li.appendChild(h2);
    li.setAttribute("class", "country-item");
    li.appendChild(p);
    countryList.appendChild(li);
  }
}
// Sort list of countries based on which sort type is pressed
function sortList(type) {
  let i, switching, li, shouldSwitch;
  switching = true;
  while (switching) {
    switching = false;
    li = countryList.getElementsByTagName("LI");
    for (i = 0; i < li.length - 1; i++) {
      shouldSwitch = false;

      // Sort depenings on which sorting type is pressed
      switch (type) {
        case "alphaAZ":
          if (
            li[i].childNodes[2].innerHTML.toLowerCase() >
            li[i + 1].childNodes[2].innerHTML.toLowerCase()
          ) {
            shouldSwitch = true;
            break;
          }
          break;
        case "alphaZA":
          if (
            li[i].childNodes[2].innerHTML.toLowerCase() <
            li[i + 1].childNodes[2].innerHTML.toLowerCase()
          ) {
            shouldSwitch = true;
            break;
          }
          break;
        case "caseAsc":
          if (
            Number(li[i].childNodes[3].innerHTML) >
            Number(li[i + 1].childNodes[3].innerHTML)
          ) {
            shouldSwitch = true;
            break;
          }
          break;
        case "caseDesc":
          if (
            Number(li[i].childNodes[3].innerHTML) <
            Number(li[i + 1].childNodes[3].innerHTML)
          ) {
            shouldSwitch = true;
            break;
          }
          break;
      }
      if (shouldSwitch) {
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
