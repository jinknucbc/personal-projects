const weatherAPI = import.meta.env.VITE_WEATHER_API;

const WeatherService = {
    // We need to set the default weather data to equal the user's location.
    // But first let me get that forecast data.
    getWeather: async (searchQuery, userLocation) => {
        try {
            // let url;
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
            let forecastData = await forecastRes.json();
            return forecastData
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default WeatherService