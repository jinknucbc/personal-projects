import React from 'react'
import WeatherCard from './WeatherCard'

function DisplayWeather({weatherObj}) {
    if (!weatherObj) {
        return <div>Nothing to show here...</div>
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
    // <div>Current temperature in Fahrenheit in {weatherObj.location.name} is {weatherObj.current.temp_f}</div>
    <WeatherCard cardData={weatherObj} />
  )
}

export default DisplayWeather