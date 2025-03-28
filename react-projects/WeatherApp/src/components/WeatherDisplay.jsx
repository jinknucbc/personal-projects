import React, {useState} from 'react'
import WeatherCard from './WeatherCard'
import ForecastCard from './ForecastCard'
import HourlyForecast from './HourlyForecast'

function DisplayWeather({forecastWeather, weatherError}) {

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
      forecastArray = forecastWeather.forecast.forecastday;
      hourlyForecast = forecastWeather.forecast.forecastday.slice(0, 2)
      .map((elem, index) => 
        {if (index === 0) {return elem.hour.slice(currTime)} 
      else {return elem.hour.slice(0, currTime + 1)}})
      .flat();
    }

  return (
    <>
      {forecastWeather ? <WeatherCard onButtonClick={onButton} cardData={forecastWeather} isCelsius={isCelsius} /> : weatherError }
      
      <div className="hourly-forecast">
        <h2>Hourly Forecast</h2>
        <div className="hourly-forecast-container">
          {hourlyForecast? hourlyForecast.map((element, index) => <HourlyForecast key={index} cardData={element} isCelsius={isCelsius} /> ) : "No hourly forecast"}
        </div>
      </div>
      <div className="daily-forecast">
        <div className="daily-forecast-container">
          <h2>Daily Forecast</h2>
          {forecastArray ? forecastArray.map((element, index) => <ForecastCard key={index} isCelsius={isCelsius} cardData={element} index={index} />) : "No forecast"}
        </div>
      </div>
    </>
    
  )
}

export default DisplayWeather