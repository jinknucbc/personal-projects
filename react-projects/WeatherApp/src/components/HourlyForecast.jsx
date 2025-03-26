import React from 'react'

function HourlyForecast({cardData, isCelsius}) {
    
    // const [today, tomorrow] = cardData
    console.log(cardData)

    const tempDisplay = isCelsius ? cardData.temp_c : cardData.temp_f;

    // The game plan is to show the hourly forecast of current day to 24 hours ahead of right now
    // which means we'll need two forecast arrays, index 0 and 1 where index 0 is the forecast of
    // the day and index 1 is the forecast of the day after. Each "hour" array has 24 elements, but
    // we only want to display from the hour after the most recent hour--if it is 10 AM right now, then
    // the hourly forecast starts from 11 AM, because 10 AM is going to be current weather--to 24 hours
    // from right now, so 11 AM to 10 AM (next day).

    // We'll need some checks to make sure that we either cut off the hourly array or pick the index after
    // the current hour.

  return (
    // The array that held two separate arrays with hourly forecast data have been flattened to a single array.
    // TO DO:
    // Loop through the single array and display those elements in a single div.
    <>
      <img src={cardData.condition.icon} />
      <p>{tempDisplay}</p>
      <p>{cardData.chance_of_rain > cardData.chance_of_snow ? cardData.chance_of_rain : cardData.chance_of_snow}</p>
    </>
  )
}

export default HourlyForecast