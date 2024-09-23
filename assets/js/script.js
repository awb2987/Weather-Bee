// Import API functions from the api.js file
import { getCityCoordinates, fetchWeatherData, fetchForecastData } from './api.js';

// Define API key here
const apiKey = 'my_api_key';

document.addEventListener('DOMContentLoaded', () => {
    // Load search history from localStorage on page load
    loadSearchHistory();

    // Add an event listener for the search form
    document.getElementById('search-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const city = document.getElementById('city-input').value.trim();
        if (city) {
            await handleSearch(city);
            document.getElementById('city-input').value = ''; // Clear input field
        }
    });
});

async function handleSearch(city) {
    try {
        const { lat, lon } = await getCityCoordinates(city);
        const weatherData = await fetchWeatherData(lat, lon);
        const forecastData = await fetchForecastData(lat, lon);

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
        saveToSearchHistory(city);
        loadSearchHistory();
    } catch (error) {
        displayError(error.message);
    }
}

function displayError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function displayCurrentWeather(data) {
    const weatherCard = document.getElementById('current-weather');
    weatherCard.innerHTML = `
        <h3>${data.name} (${new Date().toLocaleDateString()})</h3>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp} &deg;C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clears existing forecast information
    const forecastDays = data.list.filter(item => item.dt_txt.includes('12:00:00')); // Get data for noon each day

    forecastDays.forEach(day => {
        forecastContainer.innerHTML += `
            <div class="forecast-card">
                <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
                <p>Weather: ${day.weather[0].description}</p>
                <p>Temperature: ${day.main.temp} &deg;C</p>
                <p>Humidity: ${day.main.humidity}%</p>
                <p>Wind Speed: ${day.wind.speed} m/s</p>
            </div>
        `;
    });
}

function saveToSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

function loadSearchHistory() {
    const historyList = document.getElementById('search-history-list');
    historyList.innerHTML = ''; // Clear the existing search history
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', async () => {
            await handleSearch(city);
        });
        historyList.appendChild(li);
    });
}
