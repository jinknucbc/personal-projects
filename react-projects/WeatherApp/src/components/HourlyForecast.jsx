import React from 'react'

function HourlyForecast({cardData, isCelsius}) {

  const splitDate = cardData.time.split(" ")
  const splitTime = splitDate[1].split(":")

  const timeDisplay = parseInt(splitTime[0]) > 12 ? parseInt(splitTime[0]) - 12 : parseInt(splitTime[0])
  const meridiemDisplay = parseInt(splitTime[0]) >= 12 ? "PM" : "AM"

  const tempDisplay = isCelsius ? cardData.temp_c : cardData.temp_f;
  return (
    <div className="hourly-forecast-item">
      <p>{timeDisplay == 0 ? 12 : timeDisplay} {meridiemDisplay}</p>
      <img src={cardData.condition.icon} />
      <div className="temp-container">
        <p>{tempDisplay}{isCelsius ? "°C" : "°F"}</p>
      </div>
      <p className="precipitation">{cardData.chance_of_rain > cardData.chance_of_snow ? cardData.chance_of_rain : cardData.chance_of_snow}%</p>
    </div>
  )
}

export default HourlyForecast