import { useState, useEffect } from 'react'
import Header from './Header'
import '../styles/App.css'
import FetchLocation from './FetchLocation'
import WeatherService from './WeatherService'
import DisplayWeather from './WeatherDisplay'


// const Card = ({city, country}) => {
//   return (
//     <>
    
//     </>
//   )
// }



function App() {
  const {locationData, error: locationError} = FetchLocation();
  // const [currWeatherData, setCurrWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null)
  const [weatherError, setWeatherError] = useState(null);


  const onSearchApp = async (searchText) => {
    try {
      // This handler function should update weatherData so that it 
      // matches the query returned from Search and Header components.
      // setWeatherData(searchText)
    // console.log(searchText)
      const forecast = await WeatherService.getWeather(searchText);
      // Now that we can get the current weather data depending on search query,
      // we just need WeatherDisplay component to display the weather.
      // setCurrWeatherData(forecast.current);
      setForecastData(forecast)
      setWeatherError(null)
    } catch (error) {
      // setCurrWeatherData(null)
      setForecastData(null)
      setWeatherError(error)
      throw new Error(error);
    }
}

  return (
    <>
      <Header onSearch={onSearchApp} userLocation={{locationData, locationError}}/>
      {/* We're going to need another major/macro component like Header where
      we can group body components into one so that that component manages all of
      its subcomponents. For example, I need to be able to pass locationData to WeatherService
      component so that it can use that data, be it city/country name or lat/long coords, to fetch
      weather data. Having that major component will facilitate management/organization. Also, that will
      make this component less crowded.
      
      I think WeatherDisplay component would need the object returned by WeatherService.getWeather so that
      it can destructure the object.
      */}
      <DisplayWeather forecastWeather={forecastData} weatherError={weatherError} />
    </>
  )
}

export default App
