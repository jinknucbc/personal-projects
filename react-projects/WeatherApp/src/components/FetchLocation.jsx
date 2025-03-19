import { useState, useEffect } from 'react'

const geoAPI = import.meta.env.VITE_GEO_API;

function FetchLocation() {
    const [locationData, setLocationData] = useState(null);
    const [error, setError] = useState(null)

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
                                // If response is not okay, then throw an error
                                if (!res.ok) {
                                    throw new Error(`Couldn't fetch location!`)
                                }
                                const data = await res.json();
                                // Once we get the json object of response, check that results exist and that the length
                                // is greater than 0, because if it is 0, then API couldn't find any match
                                // if match found and we get appropriate results, then we update city and country
                                if (data.results && data.results.length > 0) {
                                    const result = data.results[0];
                                    setLocationData({city: result.address_components.city || result.address_components.town || result.address_components.village,
                                        country: result.address_components.country, 
                                        lat: position.coords.latitude, 
                                        long: position.coords.longitude
                                     })
                                    // setCity(result.address_components.city || result.address_components.town || result.address_components.village);
                                    // setCountry(result.address_components.country);
                                } else {
                                    setError("Location not found!");
                                }
                            } catch (error) {
                                setError(error);
                            }
                        }, (error) => {
                            setError(error.message);
                            // setLoading(false);
                        }
                    );
                } else {
                    setError(`Geolocation not supported by browser.`)
                    // setLoading(false);
                }
            };
            getLocation();
        }, [])


  return (
    {locationData, error}
  )
}

export default FetchLocation