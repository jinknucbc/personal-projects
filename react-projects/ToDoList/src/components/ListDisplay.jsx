import React from 'react'
import TheList from './TheList'

function ListDisplay() {

    // const [listArray, setListArray] = useState([])
    // 

  return (
    <div>
        <TheList />
    </div>
  )
}

// I can see this component being the page where all the lists are displayed, so it'd go something like
// return (
//    someArray.map((listData, index) => <TheList listData={listData} key={index} />)
// )
// where all the lists are going to be stored in an array and we use ".map()" method on it.

// Then, because we'll be working with arrays anyway, that should make it easier to work with useEffect as well.

// Basically, this particular component will be responsible for displaying a single list, which means it'll need
// to handle ListItem component as an array. TheList component is likely responsible for CRUD of list items (ListItem component)
// meaning TheList component is the one managing those items. That component itself will be containing an array of listItems which
// it will display.

// On a second thought, this won't be responsible for displaying a single list. Since this component has "listArray" array storing
// the lists, it'll be displaying all the existing arrays, and "App.jsx" component will be calling upon this to show the existing lists.

export default ListDisplay