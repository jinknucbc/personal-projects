import { useState, useEffect } from 'react'
import Header from './Header'
import '../styles/App.css'
import FetchLocation from './FetchLocation'
import WeatherService from './WeatherService'
import DisplayWeather from './WeatherDisplay'


function App() {
  const locationError = "";
  const [locationData, setLocationData] = useState({
    city: "",
    country: "",
    lat: 0,
    long: 0,
  })

  const [forecastData, setForecastData] = useState(null)
  const [weatherError, setWeatherError] = useState(null);
  const [userSearch, setUserSearch] = useState([""])

  const onSearchApp = async (searchText) => {
    // console.log(searchText)
    setUserSearch([searchText]);
    
  }

  const onFetch = (locData, locError) => {
    setLocationData(locData)
    if (locError) {
      setLocationError(locError)
    }
    setUserSearch([locData.city])
  }

  const onWeatherError = (error) => {
    setWeatherError(error)
  }

  useEffect(() => {
    if (userSearch[0] !== '') {
      WeatherService.getWeather(userSearch[0], onWeatherError).then((data) => setForecastData(data))
    }
  }, userSearch)


  return (
    <>
      <FetchLocation onFetch={onFetch} />
      <Header onSearch={onSearchApp} userLocation={{locationData, locationError}} weatherData={forecastData} />
      {weatherError ? <h2>Invalid search. Please make sure there's no typo!</h2> : <DisplayWeather forecastWeather={forecastData} weatherError={weatherError} />}
      {/* <DisplayWeather forecastWeather={forecastData} weatherError={weatherError} /> */}
    </>
  )
}

export default App
