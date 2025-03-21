import React, { useState } from 'react'

function WeatherCard({cardData}) {
  console.log("This is the card data: ", cardData)
    if (!cardData || !cardData.location || !cardData.current) {
        return <div>Loading...</div>
    }

    // Celsius check is going to have to be moved to WeatherDisplay or App, because
    // I don't want to create another button in ForecastCard component. So, this check
    // be done in a parent, more general component and be passed down to child components.
    const [isCelsius, setIsCelsius] = useState(true)

    const handleClick = () => {
        setIsCelsius(!isCelsius);
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