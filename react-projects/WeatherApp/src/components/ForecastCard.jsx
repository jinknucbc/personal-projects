import React from 'react'

function ForecastCard({cardData}) {

    // let date = new Date(cardData.date)
    // let asDay = date.toLocaleDateString('en-us', {weekday: 'short'});
    // console.log(date)
    // const date = cardData.date;
    // const dateArray = cardData.date.split('-');
    const dateParsed = cardData.date.split('-').map((dateComp) => parseInt(dateComp, 10));
    const formattedDate = new Date(dateParsed[0], dateParsed[1] - 1, dateParsed[2])
    const asDay = formattedDate.toLocaleDateString('en-us', {weekday: 'short'})
    // console.log(dateParsed)
    // console.log(formattedDate)
    // console.log(asDay)

  return (
    <>
        <div>
            <h3>{asDay}</h3>
            <div>
                {cardData.day.daily_chance_of_rain > cardData.day.daily_chance_of_snow ? 
                cardData.day.daily_chance_of_rain : 
                cardData.day.daily_chance_of_snow}% chance of {cardData.day.daily_chance_of_rain > cardData.day.daily_chance_of_snow ? 
                  "rain" : 
                  "snow"}
                <img src={cardData.day.condition.icon} />
                {/*  
                  To Do:
                  Display temperatures, high and low of the day
                  Do an index check and, if the received index is 0, change the day to "Today"
                  This goes for WeatherCard as well: default Forecast should be that of user's location. Again, if the user doesn't
                  agree to share location, then either display an error or tell them to search a location.
                */}
                
            </div>
        </div>
    </>
    
  )
}

export default ForecastCard