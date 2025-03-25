import React, { useState } from 'react'

function WeatherCard({cardData, onButtonClick, isCelsius}) {
  console.log("This is the card data: ", cardData)
    if (!cardData || !cardData.location || !cardData.current) {
        return <div>Loading...</div>
    }

    // Celsius check is going to have to be moved to WeatherDisplay or App, because
    // I don't want to create another button in ForecastCard component. So, this check
    // be done in a parent, more general component and be passed down to child components.
    // TO DO:
    // Move this celsius check to either WeatherDisplay.jsx or App.jsx so that ForecastCard.jsx can also access it
    // Make this receive user's location data so that the default weather always shows that of user's location.
    // If user denies access, then either display an error or tell them to search a location.
    // const [isCelsius, setIsCelsius] = useState(true)

    const handleClick = () => {
        onButtonClick();
    }

    const tempDisplay = isCelsius ? cardData.current.temp_c : cardData.current.temp_f;

  return (
    <div>
        <img src={cardData.current.condition.icon} />
        <h3>{cardData.location.name}, {cardData.location.country}</h3>
        <h3>Current temp: {tempDisplay}{isCelsius ? "°C" : "°F"}</h3> <button onClick={handleClick}>{isCelsius ? "Use Fahrenheit" : "Use Celsius"}</button>
    </div>
  )
}

export default WeatherCard