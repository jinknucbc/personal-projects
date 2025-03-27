const weatherAPI = import.meta.env.VITE_WEATHER_API;

const WeatherService = {
    // We need to set the default weather data to equal the user's location.
    // But first let me get that forecast data.
    async getWeather(searchQuery, onWeatherError) {
        try {
            // let url;
            onWeatherError(null)
            let forecastURL;
            if (searchQuery) {
                // url = `http://api.weatherapi.com/v1/current.json?key=${weatherAPI}&q=${searchQuery}`
                forecastURL = `http://api.weatherapi.com/v1/forecast.json?key=${weatherAPI}&q=${searchQuery}&days=8`
            }
            // const res = await fetch(url);
            let forecastRes = await fetch(forecastURL)
            // console.log(res.json())
            // data returned is an object that contains "current" and "location"
            // "current" contains the information about the current weather such as temp, feels_like (c/f), condition object,
            // const data = await res.json();
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