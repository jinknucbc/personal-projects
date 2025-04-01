import React, {useState} from 'react'
import ListItem from './ListItem'

function TheList() {

    // List items should be stored in an array here
    const [userText, setUserText] = useState("")
    const [listItems, setListItems] = useState([])

    /*
        This component will likely contain two textboxes--title of the list and items to be added.
        Both Edit and Remove buttons have been moved to this component. For Edit, we'll need a separate component
        which will allow the user to type something new or different. It'll need access to the listItems array along
        with the index of selected item.
    */

    const onChange = (event) => {
        // console.log(event.target.value)
        setUserText(event.target.value)
    }

   const addHandler = () => {
    if (userText.trim() !== '') {
        const itemToAdd = {
            key: crypto.randomUUID,
            text: userText,
        }
        setListItems([...listItems, itemToAdd]);
        setUserText('')
    }
   }

//    const editHandler = () => {
//     // Both this and removeHandler should trigger the selection function.
//     alert("button clicked")
//    }

//    const removeHandler = () => {
//     alert("button clicked")
//    }

   const handleItemClick = (item) => {
    console.log(item)
   }

  return (
    <>
    {/* The said list items array should use ".map()" or any method like that to display all the items here */}

    <div>
        {/* The list title should appear here in level 2 or 3 heading */}
        <textarea onChange={onChange} value={userText} placeholder='Type something'></textarea>
        {listItems ? listItems.map((itemData, index) => <ListItem itemData={itemData} key={index} onClick={handleItemClick} />) : null}
        <button onClick={addHandler}>Add</button> 
        {/* <button onClick={editHandler}>Edit</button>
        <button onClick={removeHandler}>Remove</button> */}
    </div>

    {/* // listItems.map((itemData, index) => <ListItem />) */}

    {/* // This button should allow the user to add an item. This will either add the item in the textbox or open up a textbox. */}
    </>
  )
}

export default TheList