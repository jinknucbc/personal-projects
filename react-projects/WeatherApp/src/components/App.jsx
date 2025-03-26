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

  // We might want to move searchText useState here so that DisplayWeather can be dependent on it
  // and we can take "getWeather" out of that. We can use useEffect to re-render when searchText
  // does come in or is different from the user's current location.

  // onSearchApp function may need to return searchText value instead of calling "getWeather" from it.
  // Basically, the current try-catch block will need to be independent of onSearchApp. Rather, we can
  // make this dependent on userLocation and the new useState that we may or may not define. useEffect
  // can be used to re-render. I'm wondering if we'll need a useState that is essentially searchText
  // but be updated when onSearchApp function receives some value, in which case, that function won't return
  // anything, but it will change the state defined in this component.
  

  const onSearchApp = async (searchText) => {
    try {
      // This handler function should update weatherData so that it 
      // matches the query returned from Search and Header components.
      // setWeatherData(searchText)
    // console.log(searchText)
    
      const forecast = await WeatherService.getWeather(searchText, locationData);
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

        TO DO:
        Pass location data and error to DisplayWeather so that it'll always default back to user's current location.
        If the user doesn't agree to location sharing, display either an error or tell them to search a location.

      */}
      <DisplayWeather forecastWeather={forecastData} weatherError={weatherError} />
    </>
  )
}

export default App
