import React from 'react'

function ForecastCard({cardData, isCelsius}) {

    const dateParsed = cardData.date.split('-').map((dateComp) => parseInt(dateComp, 10));
    const formattedDate = new Date(dateParsed[0], dateParsed[1] - 1, dateParsed[2])
    const asDay = formattedDate.toLocaleDateString('en-us', {weekday: 'short'})

    const maxTempDisplay = isCelsius ? cardData.day.maxtemp_c : cardData.day.maxtemp_f;
    const minTempDisplay = isCelsius ? cardData.day.mintemp_c : cardData.day.mintemp_f;

  return (
    <>
        <div className="daily-forecast-card">
            <h3>{asDay}</h3>
            <img src={cardData.day.condition.icon} />
            <div>
                <p>High: {maxTempDisplay}{isCelsius ? "°C" : "°F"}</p> 
                <p>Low: {minTempDisplay}{isCelsius ? "°C" : "°F"}</p>
                {cardData.day.daily_chance_of_rain > cardData.day.daily_chance_of_snow ? 
                cardData.day.daily_chance_of_rain : 
                cardData.day.daily_chance_of_snow}% chance of {cardData.day.daily_chance_of_rain > cardData.day.daily_chance_of_snow ? 
                  "rain" : 
                  "snow"}
            </div>
        </div>
    </>
    
  )
}

export default ForecastCard