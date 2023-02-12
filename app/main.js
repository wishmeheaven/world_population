'use strict';

// In the beginning there was a chart
// The code now looks MUCH better, but there's no chart 
// due to unsuccessful conflict with the population arrays/object

const spinner = document.querySelector('.spinner');
const chartvas = document.querySelector('#chartvas');
const chart = document.querySelector('.chart');
let button
let myLineChart;
let chartAxis = false;
let countriesData = [];  // country : name, population, flag
let populationData = [] // population : city, population, year
let existingButtons = []
let data = {}
let buttons = []
buttons = document.querySelectorAll('button');
let container;
let lastClickedButton;
let lockClick = false;


// Get buttons-container if not exists

if (container) {
    container = document.getElementById('country-buttons-container');
} else if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', 'country-buttons-container');
    document.body.appendChild(container);
}

// DOM Events delegate

document.addEventListener("click", async event => {
    if (lockClick) {
        return;
    }
    const target = event.target;
    if (lastClickedButton === target) {
        return;
    }
    lastClickedButton = target;
    const targetValue = target.getAttribute('value');
    const targetType = target.getAttribute('type');
    console.log("log targetType", targetType);
    console.log("log targetValue", targetValue);
    if (targetType !== null) {
        lockClick = true;
        // spinner.classList.remove('display');
        try {
            await fetchDataHandler(targetType, targetValue)
                .then(await UIHandler(targetType, targetValue))
            lockClick = false;
        } catch (err) {
            console.log("error", err)
        }
    }
});


// ================ UIHandler =================

const UIHandler = async (type, name) => {
    countriesData = [];
    console.log("type", type);
    console.log("name", name)

    if (type === "continent") {
        const countries = JSON.parse(localStorage.getItem(name))
        console.log("countries", countries)
        for (const [index, country] of Object.entries(countries)) {
            const countryName = country.name;
            const countryPopulation = country.population;
            const countryFlag = country.flag;
            countriesData.push({ name: countryName, population: countryPopulation, flag: countryFlag });
        }
        console.log("countriesData", countriesData)

// ----- Generate buttons for each country -----

        buttons = countriesData.map(country => {
            const button = document.createElement("button");
            button.textContent = country.name;
            button.setAttribute("value", country.name);
            button.setAttribute("type", "country");
            button.classList.add("button");
            return button;
        });
        console.log("buttons", buttons)
        if (existingButtons.length > 0) {
            existingButtons.forEach(button => button.remove());
        }
        buttons.forEach(button => {
            container.appendChild(button);
        });
        existingButtons = buttons;
    }
}

// ============= fetching Data =============

const fetchDataHandler = async (type, name) => {

    if (localStorage.getItem(name)) {
        console.log("on local storage", name)
        return JSON.parse(localStorage.getItem(name));
    }
    console.log("not (yet) on local storage")
    let url = '';
    switch (type) {
        case 'continent':
            url = `https://restcountries.com/v3.1/region/${name}`
            break;
        case 'country':
            url = 'https://countriesnow.space/api/v0.1/countries/population/cities';
            break;
        default:
            throw new Error(`Invalid type: ${type}`);
    }
    try {
        let data = [];
        const method = "GET";
        const headers = {
            "Content-Type": "application/json"
        };
        let body = null;
            const response = await fetch(url, { method, headers, body });
            data = await response.json();
            return dataProcessor(data, type)
    } catch (err) {
        console.error("error", err);
    }
}

// ================= data processor =================

const dataProcessor = (data, type) => {
    switch (type) {
        case "continent":
            return data.map(country => {
                let countryData = {
                    name: country.name.common,
                    population: country.population,
                    flag: country.flags ? country.flags.png : null,
                    continent: country.region
                };
                setLocalStorageItem(country.region, countryData);
                return countryData;
            });
        case "country": 
            return data.data.map(city => {
                // let cityData = {
                //     name: city.city,
                //     population: city.populationCounts
                // };
                citiesArr = data.map(city => city.name)
                yearsArr = data.map(city => city.population.map(pop => pop.year)).flat()
                populationData = data.map(city => city.population.map(pop => pop.value)).flat()
                console.log("cityData", cityData)
                console.log("citiesArr", citiesArr)
                setLocalStorageItem(city.country, cityData);
                return cityData;
            });
        default:
            throw new Error(`Invalid type: ${type}`);
        }
}

function setLocalStorageItem(name, values) {
    let existingData = localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : [];
    localStorage.setItem(name, JSON.stringify(existingData.concat(values)));
}

const getFromLocalStorage = key => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error retrieving data from local storage: ${error}`);
        return null;
    }
};

const setToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error storing data in local storage: ${error}`);
    }
};









// ========================================================================
// const makeChart = (countries, population) => {
//     if (chart != undefined) {
//         chart.destroy()
//     }
//     const data = {
//         labels: countries,
//         datasets: [{
//             label: 'population',
//             backgroundColor: '#407076',
//             borderColor: '#97B1A6',
//             data: population,
//         }]
//     };

//     const config = {
//         type: 'bar',
//         data: data,
//         options: {}
//     };

//     chart = new Chart(
//         document.getElementById('chartvas'),
//         config
//     );
// }


// new Chart(ctx, {
//     type: "line",
//     data: {
//         labels: newArray,
//         datasets: [
//             {
//                 label: "population of the countries",
//                 data: population,
//                 borderWidth: 1,
//             },
//         ],
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     },
// });