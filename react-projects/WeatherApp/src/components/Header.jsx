import Search from "./Search"
import DisplayLocation from "./LocationDisplay"

function Header({onSearch, userLocation, weatherData}) {
  const {locationData, locationError} = userLocation;
  const handleSearch = (searchInput) => {
    onSearch(searchInput)
  }


  return (
    <>
    <div className="header-container">
      <Search onSearch={handleSearch} locationData={locationData} />
      <DisplayLocation locationData={locationData} error={locationError} weatherData={weatherData} />
      {/*<DisplayLocation locationData={locationData} error={locationError} /> */}
      {/* <DarkMode /> */}
    </div>
    
    </>
  )
}

export default Header