'use strict';

const continentsContainer = document.querySelector('.continent-container');
// const spinner = document.querySelector('.spinner');
const ctx = document.querySelector('#chartvas');
const charter = document.querySelector('.chart-container');
let myChart;
let button
let chartAxis = false;
let countriesData = [];  // country : name, population, flag
let populationData = [] // population : city, population, year
let existingButtons = []
let data = {}
let buttons = []
buttons = document.querySelectorAll('button');
let countryButtonsContainer;
let lastClickedButton;
let lockClick = false;
let chartCleared = true;


(async function getAllContinents() {
    const continentData = await getContinents();
    const displayData = massageDataStart(continentData);
    generateContinentsButtons(displayData);
})();

// Get buttons-container if not exists

countryButtonsContainer = document.createElement('div');
countryButtonsContainer.id = "country-buttons-container";
document.body.append(countryButtonsContainer);

// DOM Events delegate

document.addEventListener("click", async (e) => {
    if (lockClick) return;
    if (e.target.tagName !== "BUTTON") return;
    if(e.target === lastClickedButton) {
        e.target.classList.toggle('clicked');
        console.log("chartCleared", chartCleared);
        chartCleared = !chartCleared;
    } else {
        if(lastClickedButton)lastClickedButton.classList.remove('clicked');
        e.target.classList.toggle('clicked');
        lastClickedButton = e.target;
        chartCleared = true;
    }
    const targetName = e.target.getAttribute('data-name');
    const targetType = e.target.getAttribute('data-type');
    lockClick = true;
    // spinner.classList.remove('display');
    try {
        await clickHandler(targetType, targetName);
        lockClick = false;
    } catch (err) {
        console.log("error", err)
        lockClick = false;
    }
});

// ================ UIHandler =================

async function clickHandler(type, name) {
    // console.log(arguments);
    if(chartCleared) {
    switch (type) {    
        case "continent":
            const continentData = await getCountriesOfContinent(name);
            const displayData = massageDataForContinent(continentData);
            generateCountriesButtons(continentData);           
            generateContinentChart(displayData, name);
            break;
        case "country":
            const citiesData = await getCitiesOfCountry(name);
            generateCountryChart(citiesData);
            generateCityButtons(citiesData);
            break;
        case "city":
            const cityData = await getCity(name);
            generateCityChart(cityData);
            break;
        }
    } else clearChart()
}

async function getContinents() {
    // get countries of continent from local storage
    const continents = JSON.parse(localStorage.getItem("continents"));
    if (continents) return continents;
    // fetch countries of continent from API
    return await fetchContinentsFromAPI();
}

async function getCountriesOfContinent(continentName) {
    // get countries of continent from local storage
    const countries = JSON.parse(localStorage.getItem(continentName));
    if (countries) return countries;
    // fetch countries of continent from API
    return await fetchCountriesOfContinentFromAPI(continentName);
}
async function getCitiesOfCountry(countryName) {
    // get cities of country from local storage
    const cities = JSON.parse(localStorage.getItem(countryName));
    if (cities) return cities;
    // fetch cities of country from API
    return await fetchCitiesOfCountryFromAPI(countryName);
}


// ----- Generate buttons for each country -----
function generateContinentsButtons(conti nents) {
    buttons = continents.map(continent => {
        const button = document.createElement("button");
        button.textContent = continent;
        button.setAttribute("data-name", continent);
        button.setAttribute("data-type", "continent");
        button.classList.add("button", "continent-buttons");
        continentsContainer.append(button);
    });
}

function generateCountriesButtons(countries) {
    countryButtonsContainer.innerHTML = '';
    buttons = countries.map(country => {
        const button = document.createElement("button");
        button.textContent = country.name.official;
        button.setAttribute("data-name", country.name.official);
        button.setAttribute("data-type", "country");
        button.classList.add("button", "country-buttons");        
        countryButtonsContainer.appendChild(button);
    });
}


// ============= fetching Data =============

async function fetchContinentsFromAPI() {
    const url = `https://restcountries.com/v3.1/all`
    return await fetchDataFromAPI(url);
}

async function fetchCountriesOfContinentFromAPI(continentName) {
    const url = `https://restcountries.com/v3.1/region/${continentName}`
    return await fetchDataFromAPI(url);
}

// {
//     "error": false,
//         "msg": "lagos with population",
//             "data": ⊖{
//         "city": "Lagos",
//             "country": "Nigeria",
//                 "populationCounts": ⊖[
//            ⊖{
//                         "year": "1991",
//                         "value": "5195247",
//                         "sex": "Both Sexes",
//                         "reliabilty": "Final figure, complete"
//                     }
//                 ]
//     }
// }
async function fetchCitiesOfCountryFromAPI(countryName) {
    url = `https://countriesnow.space/api/v0.1/countries/population/cities`
    return await fetchDataFromAPI(url);
}

async function fetchPopulationOfCityFromAPI(https://countriesnow.space/api/v0.1/countries/population/cities) {
    url = '';
    return await fetchDataFromAPI(url);
}

async function fetchDataFromAPI(url) {
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=UTF-8",
        },
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("error", err);
    }
}


// ================= data processor =================
function massageDataStart(data) {
    return Array.from(data.reduce((continents, country) =>
        continents.add(country.continents.join(''))
        , new Set()));
}

function massageDataForContinent(data) {
    return data.map(country => {
        return {
            name: country.name.official,
            population: country.population,
            flag: country.flags ? country.flags.png : null,
        };
    });
}

const dataProcessor = (data, type) => {
    switch (type) {
        case "country":
            return data.data.map(city => { // data.data.populationCount[i].year
                let cityData = {
                    name: city.city,
                    population: city.populationCounts
                };
                citiesArr = data.map(city => city.name)
                yearsArr = data.map(city => city.population.map(pop => pop.year)).flat()
                populationData = data.map(city => city.population.map(pop => pop.value)).flat()
                console.log("cityData", cityData)
                console.log("citiesArr", citiesArr)
                // setToLocalStorage(city.country, cityData);
                return cityData;
            });
        default:
            throw new Error(`Invalid type: ${type}`);
    }
}


// ========================================================================
function generateContinentChart(data, continentName) {
    const config = {
        type: "bar",
        data: {
            labels: data.map((country) => country.name.slice(0, 15)),
            datasets: [
                {
                    label: "population",
                    data: data.map((country) => country.population),
                    borderColor: "#dd3300",
                    backgroundColor: "#dd330066",
                    fill: true,
                    radius: 8,
                    hoverRadius: 12,
                    borderWidth: 1,
                    hoverBorderWidth: 2,
                },
            ],
        },
        options: {
            plugins: { title: { text: continentName, display: true } },
            // pointBackgroundColor: "#fff",
            maintainAspectRatio: false,
        },
    };
    if (myChart?.ctx) myChart.destroy();
    myChart = new Chart(ctx, config);
}
// without async
// without null
function clearChart() {
    // console.log("clearChart", clearChart)
    if (myChart?.ctx) {
    myChart.destroy();
} 

            // myChart.destroy();
            // myChart = null;
            // return true;

        // ctx.remove(); // this is my <canvas> element
        // charter.append('<canvas id="chartvas"></canvas>');
        // canvas = document.querySelector("#chartvas");
        // ctx = canvas.getContext('2d');
        // ctx.canvas.width = charter.width(); // resize to parent width
        // ctx.canvas.height = charter.height(); // resize to parent height
        // var x = canvas.width / 2;
        // var y = canvas.height / 2;
        // // ctx.font = '10pt Verdana';
        // ctx.textAlign = 'center';
        // ctx.fillText('This text is centered on the canvas', x, y);

};


// =======================================
