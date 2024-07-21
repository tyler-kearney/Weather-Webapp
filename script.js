const apiKey = "b3c4d7264485da7576262e58b032248d";
const weatherInfoElem = document.getElementById("weather-info");

// Func to fetch weather data
async function getWeatherData(city) {
    const cityParts = city.split(',');
    const cityName = cityParts[0].trim();
    let stateCode = null;
    let countryCode = null;

    // Check for state/country code
    if (cityParts.length > 1) {
        const additionalInfo = cityParts[1].trim();
        // Check for US State abbreviation format
        if (additionalInfo.length === 2 && additionalInfo.match(/^[A-Z]{2}$/)) {
            stateCode = additionalInfo;
        } else {
            countryCode = additionalInfo;
        }
    }
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}`;

    if (stateCode) {
        weatherUrl += `,${stateCode}`;
    }

    // add country code if acailable, prioritize state
    if (countryCode && !stateCode) {
        weatherUrl += `&country=${countryCode}`;
    }

    weatherUrl += `&appid=${apiKey}`;

    try {
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod == '404') {
            throw new Error('City not found');
        }

        const { lat, lon } = weatherData.coord;
        const forecast = await fetch(forecastUrl.replace('{lat}', lat).replace('{lon}', lon));
        const forecastData = await forecastResponse.json();

        // Process and display data
        displayWeather(weatherData, forecastData.hourly.slice(1, 13));
    } catch (error) {
        console.error(error);
        weatherInfoElem.innerHTML = `Error fetching weather data<hr>${error}`;
    }
}

// Function to display weather information
function displayWeather(weatherData, hourlyData) {
    const cityName = weatherData.name;
    const currentTemp = Math.floor(weatherData.main.temp - 273.15); // Convert Kelvin to Celsius
    const feelsLike = Math.floor(weatherData.main.feels_like - 273.15);
    const humidity = weatherData.main.humidity;
    const weatherDescription = weatherData.weather[0].description;

    // Clear previous content
    weatherInfoElem.innerHTML = '';

    // Create elements for displaying information
    const cityHeader = document.createElement('h2');
    cityHeader.textContnent = cityName;

    const currentConditions = document.createElement('div');
    currentConditions.classList.add('current-conditions');

    const tempSpan = document.createElement('span');
    tempSpan.classList.add('temp');
    tempSpan.textContent = `${currentTemp}°C`;

    const feelsLikeSpan = document.createElement('span');
    feelsLikeSpan.classList.add('feels-like');
    feelsLikeSpan.textContent = `${currentTemp}°C`;

    const humiditySpan = document.createElement('span');
    humiditySpan.classList.add('humidity');
    humiditySpan.textContent = `${humidity}%`;

    const descriptionSpan = document.createElement('p');
    descriptionSpan.classList.add('description');
    descriptionSpan.textContent = weatherDescription;

    // Create container for hourly forcast
    /*
    const hourlyForecast = document.createElement('div');
    hourlyForecast.classList.add('hourly-forecast');

    // Loop through hourly data and create elements
    hourlyData.forEach(hour => {
        const temp = Math.floor(hour.temp - 273.15);
        const ironUrl = `https://openweathermap.org/img/wn/${hour.weather[0]icon}@2x.png`;

        // Create element for each hour's forecast
        const hourForecast = document.createElement('div');
        hourForecast.classList.add('hour-forecast')
        // ToDo add content for each hour
    }); */

    // Add elements to the DOM
    currentConditions.appendChild(tempSpan);
    currentConditions.appendChild(feelsLikeSpan);
    currentConditions.appendChild(humiditySpan);
    weatherInfoElem.appendChild(cityHeader);
    weatherInfoElem.appendChild(currentConditions);
    weatherInfoElem.appendChild(descriptionSpan);
    // weatherInfoElem.appendChild(hourlyForecast);
}

// Event Listener for the search button
document.getElementById('search-btn').addEventListener('click', () => {
    const cityName = document.getElementById('city-input').textContent;
    if (!cityName) {
        alert("Please enter a city name");
        
    } else {
        getWeatherData(cityName);
    }
});