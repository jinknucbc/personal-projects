const weatherAPI = import.meta.env.VITE_WEATHER_API;

const WeatherService = {
    async getWeather(searchQuery, onWeatherError) {
        try {
            onWeatherError(null)
            let forecastURL;
            if (searchQuery) {
                forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${weatherAPI}&q=${searchQuery}&days=8`
            }
            let forecastRes = await fetch(forecastURL)
            if (!forecastRes.ok) {
                throw new Error(`Error fetching data. ${forecastRes.status}`)
            }

            let forecastData = await forecastRes.json();
            return forecastData
        } catch (error) {
            onWeatherError(error)
            throw new Error(error)
        }
    }
}

export default WeatherService