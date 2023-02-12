'use strict';

// =================== init ===================
// =================== clickEventsHandler ===================
// =================== UIHandler ===================
// =================== chartsHandler ===================
// =================== storageHandler ===================
// =================== fetchDataHandler ===================


// const btnEurope = document.querySelector('.europe');
// const btnAsia = document.querySelector('.asia');
// const btnAmerica = document.querySelector('.america');
// const btnAfrica = document.querySelector('.africa');
// const countriesDiv = document.querySelector('.countries');
// const chart = document.querySelector('.chart');

// const chart = document.getElementById('chart');

//==========================================================


// const africa = document.querySelector(".africa");
// const america = document.querySelector(".america");
// const asia = document.querySelector(".asia");
// const europe = document.querySelector(".europe");
// const oceania = document.querySelector(".oceania");
// const btnBox = document.querySelector(".all-btn");
// const allContinentBtn = document.querySelectorAll(".continent-btn");


// let btn = document.querySelector(".btn");
// let countries = document.querySelector(".countries");
// let btnOfCountry = document.createElement("button");

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
// reset / init
let lastClickedButton;
let lockClick = false;


// Get buttons- container if already exists
if (container) {
    container = document.getElementById('country-buttons-container');
} else if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', 'country-buttons-container');
    document.body.appendChild(container);
}

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
        spinner.classList.remove('display');
        try {
            await fetchDataHandler(targetType, targetValue)
                .then(await UIHandler(targetType, targetValue))
            lockClick = false;
        } catch (err) {
            console.log("error", err)
        }
    }
});



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

        // Generate buttons for each country
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

    // if (type === "country") {
    //     const cities = JSON.parse(localStorage.getItem(name))
    //     console.log("cities", cities)
    //     populationData = cities.map(city => {
    //         return { name: city.city, population: city.population, year: city.year }
    //     })
    //     console.log("populationData", populationData)
    //     // if (chartAxis) {
    //     //     chartAxis.destroy();
    //     // }
    //     // chartAxis = await chartsHandler(populationData);
    // }
    // spinner.classList.add('display');

}


// ==================== fetchDataHandler =========================
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
                let cityData = {
                    name: city.city,
                    population: city.populationCounts[0].population
                };
                console.log("cityData", cityData)
                setLocalStorageItem(city.country, cityData);
                return cityData;
            });
        default:
            throw new Error(`Invalid type: ${type}`);
    }
};
function setLocalStorageItem(name, values) {
    let existingData = localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : [];
    localStorage.setItem(name, JSON.stringify(existingData.concat(values)));
}


// if (isChart === true) {
//     chart.destroy();
// }

// printChart(country, citiesArr, populationArr, yearsArr) {
//     // resetChart();
//     return new Chart(chartvas, {
//         type: "bar",
//         data: {
//             labels: [...citiesArr],
//             datasets: [
//                 {
//                     label: yearsArr[0],
//                     borderColor: [
//                         "rgba(255,99,132,1)",
//                         "rgba(54, 162, 235, 1)",
//                         "rgba(255, 206, 86, 1)"
//                     ],
//                     backgroundColor: [
//                         "rgba(255, 99, 132, 0.2)",
//                         "rgba(54, 162, 235, 0.2)",
//                         "rgba(255, 206, 86, 0.2)"
//                     ],
//                     data: [...populationArr],
//                     borderWidth: 2
//                 }
//             ]
//         },
//         options: {
//             plugins: {
//                 title: {
//                     display: true,
//                     text: country
//                 }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }


// draw(["Israel","France"],[500000, 600000])
printChart('Israel',['Tel-Aviv','Eilat'],['200000', '300000'],['2020']);