import React, {useState} from 'react'
import WeatherCard from './WeatherCard'
import ForecastCard from './ForecastCard'

function DisplayWeather({forecastWeather, weatherError}) {

  let forecastArray = []

  const [isCelsius, setIsCelsius] = useState(true)

  const onButton = () => {
    setIsCelsius(!isCelsius)
  }

    if (!forecastWeather) {
        return <div>{weatherError}</div>
    }

    if (forecastWeather) {
      // console.log("This is current data: ", forecastWeather.current)

      // console.log("This is forecast data: ", forecastWeather)
      forecastArray = forecastWeather.forecast.forecastday;
      // console.log(forecastArray)
      // forecastArray.map((item, index) => console.log(item.date, index))
    }

   

  return (
    <>
      <WeatherCard onButtonClick={onButton} cardData={forecastWeather} isCelsius={isCelsius} />
      {/* TO DO:
        Going to add hourly forecast now.
      */}
      <h2>Daily Forecast</h2>
      {forecastArray ? forecastArray.map((element, index) => <ForecastCard key={index} isCelsius={isCelsius} cardData={element} />) : "No forecast"}
      
    </>
    // <div>Current temperature in Fahrenheit in {weatherObj.location.name} is {weatherObj.current.temp_f}</div>
    
  )
}

export default DisplayWeather