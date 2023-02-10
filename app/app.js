async function getData(dataType, name) {

    let url = '';
    let method = 'GET';
    let headers = { 'Content-Type': 'application/json' };
    let body = null;


    console.log("dataType", dataType)
    console.log("name", name)


    switch (dataType) {
        case 'continent':
            url = `https://restcountries.com/v2/region/${name}`;
            break;
        case 'country':
            url = `https://restcountries.com/v2/name/${name}`;
            break;
        case 'city':
            url = `https://countriesnow.space/api/v0.1/countries/population/cities/${name}`;
            // method = data.method;
            // headers = {
            //     'Accept': 'application/json',
            //     'Content-Type': 'application/json'
            // };
            // body = JSON.stringify(data.body);
            break;
        default:
            throw new Error(`Invalid type: ${type}`);
    }

    try {
        const response = await fetch(url, { method, headers, body });
        const json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}



let currentCountryButtons = [];

// Attach event listener to button
const buttons = document.querySelectorAll('button');

let container;

// Get the container if it exists
if (!container) {
    container = document.getElementById("country-buttons-container");

    // Create the container if it doesn't exist
    if (!container) {
        container = document.createElement("div");
        container.setAttribute("id", "country-buttons-container");
        document.body.appendChild(container);
    }
}
let existingButtons = container.querySelectorAll("button");


let lastClickedButton;


buttons.forEach(button => {
    button.addEventListener('click', async event => {
        const currentButton = event.target;

        // Check if the same button was clicked
        if (lastClickedButton === currentButton) {
            return;
        }

        lastClickedButton = currentButton;

        const target = event.target;
        const targetValue = target.getAttribute('value');
        const targetType = target.getAttribute('type');

        const data = await getData(targetType, targetValue);
        console.log("button.addEventListener - data", data);
        const countryNames = data.map(country => country.name);
        console.log(countryNames);

        // Create buttons for each country
        const countryButtons = countryNames.map(countryName => {
            const button = document.createElement("button");
            button.textContent = countryName;
            button.setAttribute("value", countryName);
            button.setAttribute("type", "country");
            button.classList.add("button");
            return button;
        });

        // Remove any existing buttons
        if (existingButtons.length > 0) {
            existingButtons.forEach(button => button.remove());
        }

        existingButtons = countryButtons;

        // Add the new buttons
        countryButtons.forEach(button => {
            container.appendChild(button);
        });
    });
});