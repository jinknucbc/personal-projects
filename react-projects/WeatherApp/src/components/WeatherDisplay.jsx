import React, {useState} from 'react'
import WeatherCard from './WeatherCard'
import ForecastCard from './ForecastCard'

function DisplayWeather({forecastWeather, weatherError}) {

  let forecastArray = []

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

   

    // Instead of this component returning weatherObj, I'm going to create a Card component so that
    // it only needs to pass that weatherObj data.
    // It'll look something like this
    // <WeatherCard 
    //   city={weatherObj.location.name}
    //   country={weatherObj.location.country}
    //   curr_temp_f={weatherObj.current.temp_f}
    //   curr_temp_c={weatherObj.current.temp_c}
    //   time_local={weatherObj.location.localtime}
    //   curr_humid={weatherObj.current.humidity}
    //   curr_cloud={weatherObj.current.cloud}
    // />
    // Well, it looks like passing the entire object would be better
    // <WeatherCard cardData={weatherObj} />
  return (
    <>
      <WeatherCard cardData={forecastWeather} />
      {/* 
      Even though the forecast days are contained as objects in an array, 
      because we'll be looping through the array, ForecastCard need only a single
      object passed into it as a prop.
      */}
      <h2>Daily Forecast</h2>
      {forecastArray ? forecastArray.map((element, index) => <ForecastCard key={index} cardData={element} />) : "No forecast"}
      {/* <ForecastCard cardData={forecastWeather.forecast.forecastday[0]} /> */}
    </>
    // <div>Current temperature in Fahrenheit in {weatherObj.location.name} is {weatherObj.current.temp_f}</div>
    
  )
}

export default DisplayWeather