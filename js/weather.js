
//Collaboration with class mate, Michael Garner//
const apiKey = '555b9be10835bc47f1f71541e56e5fd6';
const historyList = document.getElementById('history');
const weatherInfoDiv = document.getElementById('info-wthr');
let searchHistory= [];
//This function goes to get the current weather info but records the city entered and records the lon and lat to pass into the next function.
function fetchWeather() {
    const cityInput = document.getElementById('cityInput').value.trim();
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=imperial`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherInfo(data);
            addToHistory(cityInput);
            // Get latitude and longitude from current weather data
            const { lat, lon } = data.coord;
            fetchWeatherForecast(lat, lon);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
//function that was created to get 5 day forecast by changing the number after cnt to 5
function fetchWeatherForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&appid=${apiKey}&units=imperial`;
    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('5-Day Forecast:', data);
            displayForecast(data.list);
            console.log('5-Day Forcast:', data.list.dt);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
// This function decides what to display.
function displayWeatherInfo(data) {
    // Displays current weather information
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    weatherInfoDiv.innerHTML = `
        <p>Temperature: ${temperature} F</p>
        <p>Description: ${description}</p>
        <img src="${iconUrl}" alt="Weather Icon">
    `;
}
// displays the 5 day forecast
function displayForecast(forecastList) {
    // Displays 5-day forecast information
    forecastList.forEach(day => {
        const date = new Date(day.dt *1000);
        const temperature = day.temp.day;
        const description = day.weather[0].description;
        const iconCode = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        // Creates a forecast box element
        const forecastBox = document.createElement('div');
        forecastBox.classList.add('forecast-box');
        forecastBox.innerHTML = `
            <p>${date.toDateString()}</p>
            <p>Temperature: ${temperature} F</p>
            <p>Description: ${description}</p>
            <img src="${iconUrl}" alt="Weather Icon">
        `;
        // Append the forecast box to the weather info div
        weatherInfoDiv.appendChild(forecastBox);
    });
}
function addToHistory(city) {
    // Add city to history list
    searchHistory.unshift(city); // Add the city to the beginning of the array
    if (searchHistory.length > 5) {
        searchHistory.pop(); // Remove the last element if the history length exceeds 5
    }
    renderSearchHistory();
}
function renderSearchHistory() {
    // Clear previous search history
    historyList.innerHTML = '';
    // Render search history
    searchHistory.forEach(city => {
        const historyItem = document.createElement('div');
        historyItem.textContent = city;
        historyItem.classList.add('history-item');
        historyItem.addEventListener('click', () => {
            navigateToCity(city);
        });
        historyList.appendChild(historyItem);
    });
}
function navigateToCity(city){
    document.getElementById('cityInput').value= city;
    fetchWeather();
}
console.log("Hello World");