import React, {useState} from 'react'
import WeatherCard from './WeatherCard'
import ForecastCard from './ForecastCard'
import HourlyForecast from './HourlyForecast'

function DisplayWeather({forecastWeather, weatherError}) {

  // By default, we should show the weather of the user's location. WeatherService component would have to return
  // the weather data of user's location.

  const currTime = new Date().getHours();

  let forecastArray = []
  let hourlyForecast = []

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
      hourlyForecast = forecastWeather.forecast.forecastday.slice(0, 2)
      .map((elem, index) => 
        {if (index === 0) {return elem.hour.slice(currTime)} 
      else {return elem.hour.slice(0, currTime + 1)}})
      .flat();
      // console.log(hourlyForecast)
    }

  // TO DO:
  // 

  return (
    <>
      <WeatherCard onButtonClick={onButton} cardData={forecastWeather} isCelsius={isCelsius} />
      
      <div>
        <h2>Hourly Forecast</h2>
        {hourlyForecast? hourlyForecast.map((element, index) => <HourlyForecast key={index} cardData={element} isCelsius={isCelsius} /> ) : "No hourly forecast"}
        {/* // <HourlyForecast cardData={hourlyForecast} isCelsius={isCelsius} /> */}
      </div>
      <h2>Daily Forecast</h2>
      {forecastArray ? forecastArray.map((element, index) => <ForecastCard key={index} isCelsius={isCelsius} cardData={element} />) : "No forecast"}
      
    </>
    
  )
}

export default DisplayWeather