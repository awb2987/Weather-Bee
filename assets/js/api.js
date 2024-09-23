// Define API key
const apiKey = process.env.API_KEY;

/**
 * Get coordinates for the desired city.
 * @param {string} city - The name of the desired city.
 * @returns {Promise<Object>} - An object containing latitude and longitude.
 */
async function getCityCoordinates(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const data = await response.json();
        if (response.status !== 200) throw new Error(data.message || 'City was not found');
        return { lat: data.coord.lat, lon: data.coord.lon };
    } catch (error) {
        console.error('Error fetching desired city coordinates:', error);
        throw error;
    }
}

/**
 * Fetch current weather data.
 * @param {number} lat - Latitude of the desired city.
 * @param {number} lon - Longitude of the desired city.
 * @returns {Promise<Object>} - Current weather data.
 */
async function fetchWeatherData(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (response.status !== 200) throw new Error(data.message || 'Failed to fetch the weather data');
        return data;
    } catch (error) {
        console.error('Error fetching desired weather data:', error);
        throw error;
    }
}

/**
 * Fetch 5-day forecast data for desired city.
 * @param {number} lat - Latitude of the desired city.
 * @param {number} lon - Longitude of the desired city.
 * @returns {Promise<Object>} - 5-day forecast data for desired city.
 */
async function fetchForecastData(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (response.status !== 200) throw new Error(data.message || 'Failed to fetch forecast data for desired city');
        return data;
    } catch (error) {
        console.error('Error fetching desired forecast data:', error);
        throw error;
    }
}

// Export functions for use in script.js
export { getCityCoordinates, fetchWeatherData, fetchForecastData };
