import React, {useRef, useEffect, useState} from 'react'
import ListItem from './ListItem'
import ItemEdit from './ItemEdit'
import ItemRemove from './ItemRemove'

function TheList() {

    // List items should be stored in an array here
    const [userText, setUserText] = useState("")
    const [listItems, setListItems] = useState([])
    const [selectItem, setSelectItem] = useState(null)
    const [inEditMode, setInEditMode] = useState(false)
    const [canSelect, setCanSelect] = useState(false)
    const [inRemoveMode, setInRemoveMode] = useState(false)
    const [removeSelected, setRemoveSelected] = useState([])
    const listContainer = useRef(null)

    // Change isEditable to "editMode" and "canRemove" to "removeMode".

    /*
        This component will likely contain two textboxes--title of the list and items to be added.
        Both Edit and Remove buttons have been moved to this component. For Edit, we'll need a separate component
        which will allow the user to type something new or different. It'll need access to the listItems array along
        with the index of selected item.
    */

    useEffect(() => {
        const handleOutSideClick = (event) => {

            if (canSelect && !listContainer.current.contains(event.target)) {
                setCanSelect(!canSelect)
                setInEditMode(!inEditMode)
                setInRemoveMode(!inRemoveMode)
                setSelectItem(null)
                setRemoveSelected([])
            }
        }
        document.addEventListener("mousedown", handleOutSideClick)

        return () => {document.removeEventListener("mousedown", handleOutSideClick)}
    }, [canSelect, listContainer])

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
    // console.log("This is before it is negated in Edit: ", canSelect)
    if (!canSelect) {
        console.log("Testing testing")
        setCanSelect(!canSelect)
    }
    // if (inRemoveMode) {
    //     setInRemoveMode(!inRemoveMode)
    //     setRemoveSelected([])
    // }
    setInEditMode(!inEditMode)


    // if (canSelect) {
    //     console.log(selectItem)
    //     listItems.find((itemObj) => itemObj.key === selectItem.key ? setIsEditable(!isEditable) : console.log("Not here"))
    // }
   }

   const removeHandler = () => {
    /*
        One of the ways we can "remove" an item is to use the key/ID of the item and then run either ".filter" method or construct a new
        array and leave out the item whose key/ID matches that of the selected. Even for multi-select, this should work.
        As far as multi-selecting is concerned, editing wouldn't need it because there should be no point to editing multiple things to
        the same thing. What I'm thinking now is that we may do the operations in reverse order. Instead of clicking on an item to choose
        between Edit and Remove, when the user clicks either, it should allow them to proceed with it. That way, if the user wants to remove
        multiple items at once, they'll be able to do so while editing only one thing at a time.

        Since Remove will allow multiple selections, it should keep an array of keys of selected items. Where we currently have ".filter" method,
        we'll use a "foreach" loop on the array of keys. So, listItems array calls on either ".map" or ".filter", and then that other array is
        going to be the main character of that "foreach" loop.
    */
//    setListItems(listItems.filter((item) => {return item.key !== selectItem.key}))
    // alert("button clicked")
    // console.log("This is before it is negated in Remove: ", canSelect)
    if (!inRemoveMode) {
        setInRemoveMode(!inRemoveMode)
    }
    if (!canSelect) {
        setCanSelect(!canSelect)
    }
    // if (inEditMode) {
    //     setInEditMode(!inEditMode)
    //     setSelectItem(null)
    // }
    
    // Gonna need a separate "Confirm" and "Cancel" button for Remove mode.

   }

   const onConfirmRemove = () => {
    if (removeSelected) {
        setListItems(listItems.filter((item) => !removeSelected.includes(item.key)))
    }
    setRemoveSelected([])
    setInRemoveMode(!inRemoveMode)
    setCanSelect(!canSelect)
   }

   const onCancelRemove = () => {
    if (inRemoveMode) {
        setInRemoveMode(!inRemoveMode)
    }
    if (removeSelected) {
        setRemoveSelected([])
    }
    setRemoveSelected([])
    setInRemoveMode(!inRemoveMode)
    setCanSelect(!canSelect)
   }

   const handleItemClick = (item) => {
    // console.log(listContainer.current)
    // console.log(selectItem)
    // console.log(canSelect)
    // if (!selectItem) {
    //     // This checks if there is an item currently selected. If not, we set the item received as the selected item.
    //     // I think one of the things I was considering was to check if Edit or Remove mode is activated, and, depending
    //     // on whichever mode, either set it as THE selected item or just add the currently selected item into an array.
    //     // What that means is we'd need two separate item trackers
    //     // console.log("Yeah we're here")

    //     if (inEditMode) {
    //         setSelectItem(item)
    //     }
    //     else if (inRemoveMode) {
    //         setRemoveSelected([...removeSelected, item.key])
    //         // console.log(item.key)
    //     }
    //     // console.log(removeSelected)
    // } 
    if (inEditMode && canSelect) {
        setRemoveSelected([])
        if (!selectItem) {
            setSelectItem(item)
        }
        else {
            setSelectItem(null)
        }
    } else if (inRemoveMode && canSelect) {
        setSelectItem(null)
        if (!removeSelected.includes(item.key)) {
            // If first time selecting, then add to array
            setRemoveSelected([...removeSelected, item.key])
        } else {
            // If not first time selecting, then deselect
            setRemoveSelected(removeSelected.filter((element) => {return element !== item.key}))
        }
    }
    else {
        // For now, if selected item is selected again, it deselects.
        setSelectItem(null)
    }
    // console.log(selectItem)
    // console.log(removeSelected)
   }

   const onSaveEdit = (editedItem) => {    
    // console.log(listItems[0].key)
    const updatedList = listItems.map((itemObj) => {
        // console.log(itemObj.key, editedItem.key) 
        return itemObj.key === editedItem.key ? editedItem : itemObj})
    // console.log(updatedList)
    setListItems(updatedList)
    setSelectItem(null)
    setCanSelect(!canSelect)
    setInEditMode(!inEditMode)
   }

   const onCancelEdit = () => {
    setCanSelect(!canSelect)
    setInEditMode(!inEditMode)
    setSelectItem(null)
   }

  return (
    <>
    {/* The said list items array should use ".map()" or any method like that to display all the items here */}

    <div ref={listContainer} >
        {/* The list title should appear here in level 2 or 3 heading */}
        <textarea onChange={onChange} value={userText} placeholder='Type something'></textarea>
        {listItems ? listItems.map((itemData, index) => <ListItem itemData={itemData} key={index} onClick={canSelect ? handleItemClick : null} canSelect={canSelect} />) : null}
        {/*
            For the change I'm going to make, we're going to change the conditions here. Instead of Edit and Remove buttons depending on
            selectItem condition, it'll now depend on the length of the listItems array. If 0, then the buttons are disabled. If not, if there
            is at least one item that can be edited or removed, then it will be enabled. For Add button, the condition will still depend on
            whether or not an item is selected. Once again, I do not see the point of duplicating items.
        */}
        <button onClick={addHandler} disabled={canSelect}>Add</button> 
        <button onClick={editHandler} disabled={listItems.length === 0}>Edit</button>
        <button onClick={removeHandler} disabled={listItems.length === 0}>Remove</button>

        {inEditMode && selectItem ? <ItemEdit currItem={selectItem} onSaveEdit={onSaveEdit} onCancelEdit={onCancelEdit} /> : null}
        {inRemoveMode ? <ItemRemove onConfirmRemove={onConfirmRemove} onCancelRemove={onCancelRemove} selectedItems={removeSelected} /> : null}
    </div>

    {/* // listItems.map((itemData, index) => <ListItem />) */}

    {/* // This button should allow the user to add an item. This will either add the item in the textbox or open up a textbox. */}
    </>
  )
}

export default TheList