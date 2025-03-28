import React from 'react'

function DisplayLocation({locationData, error, weatherData}) {

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!locationData) {
        return <div>Locating your area...</div>
    }

    if (locationData.city === '' || locationData.country === '') {
      if (weatherData) {
        return null
      }
      return (
        <div>
          <h2 className="error-message">There was an error locating your area. Please search by city or country.</h2>
        </div>
      )
    }

}

export default DisplayLocation