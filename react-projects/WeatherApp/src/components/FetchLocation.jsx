import { useState, useEffect } from 'react'

const geoAPI = import.meta.env.VITE_GEO_API;

function FetchLocation({onFetch}) {

    const [error, setError] = useState(null)

    const updateLocData = (locObj) => {
        onFetch(locObj, error)
    }


    useEffect(() => {
            // The process of getting user's location shouldn't affect the overall flow of the app
            // so, we'll make getLocation an async function
            const getLocation = async () => {
                // If geolocation object available, then we'll get current pos using it
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            try {
                                // Call on Geocod API to search using reverse geocoding by using user's current lat and long
                                const res = await fetch(
                                    `https://api.geocod.io/v1.7/reverse?q=${position.coords.latitude},${position.coords.longitude}&api_key=${geoAPI}`
                                );
                                if (!res.ok) {
                                    throw new Error(`Couldn't fetch location!`)
                                }
                                const data = await res.json();
                                if (data.results && data.results.length > 0) {
                                    const result = data.results[0];
                                    updateLocData({city: result.address_components.city || result.address_components.town || result.address_components.village,
                                        country: result.address_components.country, 
                                        lat: position.coords.latitude, 
                                        long: position.coords.longitude
                                     })
                                     
                                } else {
                                    setError("Location not found!");
                                }
                            } catch (error) {
                                setError(error);
                            }
                        }, (error) => {
                            setError(error.message);
                        }
                    );
                } else {
                    setError(`Geolocation not supported by browser.`)
                }
            };
            getLocation();
            
        }, [])

  return null
  
}

export default FetchLocation