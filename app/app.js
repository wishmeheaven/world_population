async function getData(dataType, name) {
    let url = '';
    let method = 'GET';
    let headers = { 'Content-Type': 'application/json' };
    let body = null;

    switch (dataType) {
        case 'continent':
            url = `https://restcountries.com/v2/region/${name}`;
            break;
        case 'country':
            url = `https://restcountries.com/v2/name/${name}`;
            break;
        case 'city':
            url = `https://countriesnow.space/api/v0.1/countries/population/cities/${name}`;
            method = data.method;
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            body = JSON.stringify(data.body);
            break;
        default:
            throw new Error(`Invalid type: ${type}`);
    }

    try {
        const response = await fetch(url, { method, headers, body });
        const json = await response.json();
        console.log(JSON.stringify(json));
    } catch (error) {
        console.error(error);
    }
}
async function fetchData(button) {
    const className = button.className;
    const url = `https://restcountries.com/v3.1/region/${className}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
}

// Attach event listener to button
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('click', async event => {
        const target = event.target;
        const continent = target.getAttribute('value');
        console.log(continent)
        const url = `https://restcountries.com/v2/region/${continent}`;
        const response = await fetch(url);
        const data = await response.json();
        const countryNames = data.map(country => country.name);
        console.log(countryNames);
    });
});