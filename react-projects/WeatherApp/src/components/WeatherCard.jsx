
function WeatherCard({cardData, onButtonClick, isCelsius}) {
    if (!cardData || !cardData.location || !cardData.current) {
      console.log("Check check")
        return <div>Loading...</div>
    }

    const handleClick = () => {
        onButtonClick();
    }

    const tempDisplay = isCelsius ? cardData.current.temp_c : cardData.current.temp_f;

    if (cardData) {
      return (
    <div className="weather-card">
        <img src={cardData.current.condition.icon} />
        <h3>{cardData.location.name}, {cardData.location.country}</h3>
        <h3>Current temp: {tempDisplay}{isCelsius ? "°C" : "°F"}</h3> <button onClick={handleClick}>{isCelsius ? "Use Fahrenheit" : "Use Celsius"}</button>
    </div>
  )
}
}

export default WeatherCard