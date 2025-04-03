import React, {useState} from 'react'
import ListItem from './ListItem'
import ItemEdit from './ItemEdit'

function TheList() {

    // List items should be stored in an array here
    const [userText, setUserText] = useState("")
    const [listItems, setListItems] = useState([])
    const [selectItem, setSelectItem] = useState(null)
    const [isEditable, setIsEditable] = useState(false)

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
            key: crypto.randomUUID(),
            text: userText,
        }
        setListItems([...listItems, itemToAdd]);
        setUserText('')
    }
   }

   const editHandler = () => {
    // Both this and removeHandler should trigger the selection function.
    // console.log(selectItem)
    if (selectItem) {
        listItems.find((itemObj) => itemObj.key === selectItem.key ? setIsEditable(!isEditable) : console.log("Not here"))
    }
   }

   const removeHandler = () => {
    /*
        One of the ways we can "remove" an item is to use the key/ID of the item and then run either ".filter" method or construct a new
        array and leave out the item whose key/ID matches that of the selected.
    */
   setListItems(listItems.filter((item) => {return item.key !== selectItem.key}))
   console.log(newArray)
    // alert("button clicked")
   }

   const handleItemClick = (item) => {
    if (!selectItem) {
        setSelectItem(item)
    }
    else {
        // For now, if selected item is selected again, it deselects.
        setSelectItem(null)
    }
   }

   const onSaveEdit = (editedItem) => {    
    // console.log(listItems[0].key)
    const updatedList = listItems.map((itemObj) => {
        // console.log(itemObj.key, editedItem.key) 
        return itemObj.key === editedItem.key ? editedItem : itemObj})
    // console.log(updatedList)
    setListItems(updatedList)
    setSelectItem(null)
    setIsEditable(!isEditable)
   }

   const onCancelEdit = () => {
    setIsEditable(!isEditable)
    setSelectItem(null)
   }

  return (
    <>
    {/* The said list items array should use ".map()" or any method like that to display all the items here */}

    <div>
        {/* The list title should appear here in level 2 or 3 heading */}
        <textarea onChange={onChange} value={userText} placeholder='Type something'></textarea>
        {listItems ? listItems.map((itemData, index) => <ListItem itemData={itemData} key={index} onClick={handleItemClick} />) : null}
        <button onClick={addHandler} disabled={selectItem}>Add</button> 
        <button onClick={editHandler} disabled={!selectItem}>Edit</button>
        <button onClick={removeHandler} disabled={!selectItem}>Remove</button>

        {isEditable ? <ItemEdit currItem={selectItem} onSaveEdit={onSaveEdit} onCancelEdit={onCancelEdit} /> : null}
    </div>

    {/* // listItems.map((itemData, index) => <ListItem />) */}

    {/* // This button should allow the user to add an item. This will either add the item in the textbox or open up a textbox. */}
    </>
  )
}

export default TheList