
function WeatherCard({cardData, onButtonClick, isCelsius}) {
  // console.log("This is the card data: ", cardData)
    if (!cardData || !cardData.location || !cardData.current) {
      console.log("Check check")
        return <div>Loading...</div>
    }

    // TO DO:
    // Make this receive user's location data so that the default weather always shows that of user's location.
    // If user denies access, then either display an error or tell them to search a location.

    const handleClick = () => {
        onButtonClick();
    }

    const tempDisplay = isCelsius ? cardData.current.temp_c : cardData.current.temp_f;

    if (cardData) {
      return (
    <div>
        <img src={cardData.current.condition.icon} />
        <h3>{cardData.location.name}, {cardData.location.country}</h3>
        <h3>Current temp: {tempDisplay}{isCelsius ? "°C" : "°F"}</h3> <button onClick={handleClick}>{isCelsius ? "Use Fahrenheit" : "Use Celsius"}</button>
    </div>
  )
}
}

export default WeatherCard