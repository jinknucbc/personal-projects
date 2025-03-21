import React from 'react'

function ForecastCard({cardData}) {

    const date = new Date(cardData.date)
    const asDay = date.toLocaleDateString('en-us', {weekday: 'short'});

  return (
    <>
        <div>
            <h3>{asDay}</h3>
            <div>
                {cardData.day.daily_chance_of_rain > cardData.day.daily_chance_of_snow ? 
                cardData.day.daily_chance_of_rain : 
                cardData.day.daily_chance_of_snow}
                <img src={cardData.day.condition.icon} />
                
            </div>
        </div>
    </>
    
  )
}

export default ForecastCard