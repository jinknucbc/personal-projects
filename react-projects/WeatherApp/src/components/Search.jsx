import { useState } from "react"

function Search({onSearch, locationData}) {

  // If we take searchText useState out of this component, then it'll need to receive searchText as a prop.
  // Actually, searchText may stay here because it is necessary to show feedback to user as they type.

    const [searchText, setSearchText] = useState("")
    
    

    const handleChange = (event) => {
        setSearchText(event.target.value)
    }

    const handleClick = () => {
        onSearch(searchText)
    }

  return (
    <>
    <div className="search-container">
        <input 
        type="text"
        id="searchbox"
        placeholder="Type your city and/or country"
        value={searchText}
        onChange={handleChange}
        />
        <button
        id="search-button"
        className="search-button"
        onClick={handleClick}
        >Search</button>
    </div>
    </>
  )
}

export default Search