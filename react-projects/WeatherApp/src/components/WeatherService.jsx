const weatherAPI = import.meta.env.VITE_WEATHER_API;

const WeatherService = {
    getWeather: async (searchQuery) => {
        try {
            let url;
            if (searchQuery) {
                url = `http://api.weatherapi.com/v1/current.json?key=${weatherAPI}&q=${searchQuery}`
            }
            const res = await fetch(url);
            // console.log(res.json())
            // data returned is an object that contains "current" and "location"
            // "current" contains the information about the current weather such as temp, feels_like (c/f), condition object,
            const data = await res.json();
            return data
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default WeatherService