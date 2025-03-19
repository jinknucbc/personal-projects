import Search from "./Search"
import DisplayLocation from "./LocationDisplay"

function Header({onSearch, userLocation}) {
  const {locationData, locationError} = userLocation;
  const handleSearch = (searchInput) => {
    onSearch(searchInput)
  }

  return (
    <>
    <div className="header-container">
      <Search onSearch={handleSearch}/>
      <DisplayLocation locationData={locationData} error={locationError} />
      {/* <DarkMode /> */}
    </div>
    
    </>
  )
}

export default Header