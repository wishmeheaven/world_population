
async function getData(dataType, name) {
    let url = '';
    const method = "GET";
    const headers = {
        "Content-Type": "application/json"
    };
    let body = null;
    try {

        //countryCities
        // url = "https://countriesnow.space/api/v0.1/countries"

        // citiesPopulation
        // url = "https://countriesnow.space/api/v0.1/countries/population/cities"

        //countriesPopulation
        // url  = "https://countriesnow.space/api/v0.1/countries/countries/population"

        const response = await fetch(url, { method, headers, body });
        const json = await response.json();
        console.log("json", json)
    } catch (error) {
        console.error(error);
    }

    


    switch (dataType) {
        case 'continent':
            url = `https://restcountries.com/v2/region/${name}`;
            break;
        case 'country':
            url = fetch('https://countriesnow.space/api/v0.1/countries/population/cities/filter', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "limit": 1000,
                        "order": "asc",
                        "orderBy": "name",
                        "country": `${name}`
                    })
                })
            break;
        case 'cities':
            url = `https://countriesnow.space/api/v0.1/countries/population/cities/${name}`;
            break;
        default:
            throw new Error(`Invalid type: ${type}`);
    }

    try {
        const response = await fetch(url, { method, headers, body });
        const json = await response.json();
        console.log("json", json)

        if(dataType === 'country'){        
            localStorage.setItem('country', JSON.stringify(json))
            localStorage.setItem('countryName', name)
            localStorage.setItem('countryData', JSON.stringify(json.data))
        } else if(dataType === 'cities'){
            localStorage.setItem('city', JSON.stringify(json))
            localStorage.setItem('cityName', name)
            localStorage.setItem('cityData', JSON.stringify(json.data))
            localStorage.setItem('cityPopulation', JSON.stringify(json.data[0].populationCounts[0].value))
            localStorage.setItem('cityCountry', JSON.stringify(json.data[0].country))        
        }
        return json;
    } catch (error) {
        console.error(error);
    }
}

let buttons = document.querySelectorAll('button');

let container;

// Get the container if it exists
if (container) {
    container = document.getElementById('country-buttons-container');
} else if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', 'country-buttons-container');
    document.body.appendChild(container);
}


let existingButtons = container.querySelectorAll('button');
let countryNames = [];
let cityNames = []
let currentCountryButtons = [];
let lastClickedButton;



document.addEventListener("click", async event => {
    const target = event.target;

    console.log('document.addEventListener - target', target)


    // Check if the same button was clicked
    if (lastClickedButton === target) {
        return;
    }

    lastClickedButton = target;

    const targetValue = target.getAttribute('value');
    const targetType = target.getAttribute('type');

    const data = await getData(targetType, targetValue);

    console.log("typeofData", typeof data)

    console.log("button.addEventListener - data", data);
    // Delegate the event to the appropriate function based on the button type
    if (targetType === "continent") {
        countryNames = data.map(continent => continent.name)
        handleClick(countryNames);
    } else if (targetType === "country") {
        console.log("data", data.data)
        cityNames = data.data.map(country => country.city)
        // data.map(country => country.city)
        handleClick(cityNames);
        // handleClick(data.map(el => el.data), "city");
    } else if (targetType === "city") {
        console.log(data.map(el => el.data));
    }
});

function processData(data) {
    const processedData = data.data.map(cityData => {
        return {
            city: cityData.city,
            country: cityData.country,
            population: cityData.populationCounts[0].value
        };
    });

    return processedData;
}


function handleClick(requestedType) {
    // let buttons = []
    console.log("handleClick - data", requestedType)
    // console.log("handleClick - type", type)
    if (requestedType === countryNames) {
        buttons = countryNames.map(name => {
            const button = document.createElement("button");
            button.textContent = name;
            button.setAttribute("value", name);
            button.setAttribute("type", "country");
            button.classList.add("button");
            return button;
        });
    } else if (requestedType === cityNames){
        buttons = data.map(name => {
            const button = document.createElement("button");
            button.textContent = name;
            button.setAttribute("value", name);
            button.setAttribute("type", type);
            button.classList.add("city");
            return button;
        });
        // let processedData = processData(data);
    }
    console.log(existingButtons.length)
    // Remove existing buttons
    if (existingButtons.length > 0) {
        existingButtons.forEach(button => button.remove());
    }
    // Add the new buttons
    buttons.forEach(button => {
        container.appendChild(button);
    });
    existingButtons = buttons
}


