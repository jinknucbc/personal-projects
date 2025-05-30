import React, {useRef, useEffect, useState, useContext} from 'react'
import ListItem from './ListItem'
import ItemEdit from './ItemEdit'
import ItemRemove from './ItemRemove'
import { useNavigate, useParams } from 'react-router-dom'
import {ContextContainer} from "./ListContext"
import { auth } from '../firebaseConfig'
import { useAuth } from './AuthContext'

function TheList({isNew}) {

    // List items should be stored in an array here
    const [userText, setUserText] = useState("")
    const [listItems, setListItems] = useState([])
    const [selectItem, setSelectItem] = useState(null)
    const [inEditMode, setInEditMode] = useState(false)
    const [canSelect, setCanSelect] = useState(false)
    const [inRemoveMode, setInRemoveMode] = useState(false)
    const [removeSelected, setRemoveSelected] = useState([])
    const listContainer = useRef(null)
    const [currentList, setCurrentList] = useState(null)
    const {id} = useParams()
    const {onCreateList, listArray, setListArray, updateList, fetchLists, removeItems} = useContext(ContextContainer)
    const {user} = useAuth()
    const nav = useNavigate();

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

    useEffect(() => {
        if (isNew) {
            // console.log("Can we get here?")
            setCurrentList({
                id: id,
                title: "New List",
                content: []
            })
            // console.log(currentList)
        } else {
            console.log(listArray)
            const fetchList = listArray.find((lists) => lists.id === id)
            console.log(fetchList)
            // const fetchedLists = fetchLists(auth.currentUser.uid)
            if (fetchList) {
                // console.log(fetchList)
                setCurrentList(fetchList)
                // if (!listItems)
            }
        }
    }, [id, isNew])

    useEffect(() => {
        if (currentList && listItems) {
            setCurrentList({ ...currentList, content: listItems})
        }
        // console.log(currentList)
    }, [listItems])

    const onChange = (event) => {
        // console.log(event.target.value)
        setUserText(event.target.value)
    }

   const addHandler = () => {
    if (userText.trim() !== '') {
        const itemToAdd = {
            itemId: crypto.randomUUID(),
            itemText: userText,
        }
        // setListItems([...listItems, itemToAdd]);
        setCurrentList((prevList) => ({...prevList, content: [...prevList.content, itemToAdd]}))
        setUserText('')
    }
   }

   const editHandler = () => {
    // Both this and removeHandler should trigger the selection function.
    if (!canSelect) {
        setCanSelect(!canSelect)
    }
    setInEditMode(!inEditMode)

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
    if (!inRemoveMode) {
        setInRemoveMode(!inRemoveMode)
    }
    if (!canSelect) {
        setCanSelect(!canSelect)
    }

   }

   const onConfirmRemove = () => {
    if (removeSelected) {
        // Probably better to have a temporary variable to store the changed content array and then reassign the content array with that...
        setCurrentList((prevList) => ({...prevList, content: prevList.content.filter((item) => !removeSelected.includes(item.itemId))}))
        removeItems(user.uid, id, removeSelected)
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
    // console.log(listItems)
    
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
        if (!removeSelected.includes(item.itemId)) {
            // If first time selecting, then add to array
            setRemoveSelected([...removeSelected, item.itemId])
        } else {
            // If not first time selecting, then deselect
            setRemoveSelected(removeSelected.filter((element) => {return element !== item.itemId}))
        }
    }
    else {
        // For now, if selected item is selected again, it deselects.
        setSelectItem(null)
    }

   }

   const onSaveEdit = (editedItem) => {    
    const updatedList = currentList.content.map((itemObj) => {
        return itemObj.itemId === editedItem.itemId ? editedItem : itemObj})
    setCurrentList((prevList) => ({...prevList, content: updatedList}))
    setListArray((oldLists) => 
        oldLists.map((list) => {
            if (list.id === id) {
                list.content.map((listItem) => {
                    if (listItem.itemId === editedItem.itemId) {
                        return {...listItem, itemText: editedItem.itemText}
                    }
                })
            }
            return list
        })
    
        )
    // console.log(listArray)
    setSelectItem(null)
    setCanSelect(!canSelect)
    setInEditMode(!inEditMode)
   }

   const onCancelEdit = () => {
    setCanSelect(!canSelect)
    setInEditMode(!inEditMode)
    setSelectItem(null)
   }

   const handleFinish = () => {
    // This is after that "finish" button is pressed, meaning this will only be active when we're dealing with a completely new list.
    // That being the case, we'll still need a manager function coming from MainScreen.jsx so that this can be "broadcast" to that component.
    // And that's when we can pass the list object to "MainScreen.jsx" and include it in the overall list array.
    // console.log(onCreateList)
    if (isNew) {
        onCreateList(currentList) // currentList has the list ID, title, and content array. This is received as "listArray" in ListContext
    } else {
        // console.log(id)
        updateList(id, currentList)
        nav("/main-screen")
    }
    // We probably should disable remove mode here as well. Put that at the top to make sure the mode is disabled.
   }

   const handleChangeTitle = (e) => {
    setCurrentList({...currentList, title: e.target.value })
   }

   if (!currentList) {
    // console.log(id)
    // console.log(listArray)
    return <div>Creating a list...</div>
   }

  return (
    <>
    {/* The said list items array should use ".map()" or any method like that to display all the items here */}
    {/* {console.log(currentList)} */}
    <div ref={listContainer} style={{border: "solid"}} >
        <div>
            <h2>{currentList.title}</h2>
            <input type="text" placeholder='Title' value={currentList.title} onChange={handleChangeTitle} />
        </div>
        {/* The list title should appear here in level 2 or 3 heading */}
        <div>
            <textarea onChange={onChange} value={userText} placeholder='Type something'></textarea>
            {currentList.content && currentList.content.map((itemData, index) => <ListItem itemData={itemData} key={itemData.itemId ? itemData.itemId : itemData.clientId} onClick={canSelect ? handleItemClick : null} canSelect={canSelect} />)}
            {/* The "key" part here will need to be changed to itemData.itemKey, and "itemData" can now be changed to itemData.text */}
        </div>
        <button onClick={addHandler} disabled={canSelect}>Add</button> 
        <button onClick={editHandler} disabled={currentList.content.length === 0}>Edit</button>
        <button onClick={removeHandler} disabled={currentList.content.length === 0}>Remove</button>
        <button onClick={handleFinish}>Finish</button>

        {inEditMode && selectItem ? <ItemEdit currItem={selectItem} onSaveEdit={onSaveEdit} onCancelEdit={onCancelEdit} /> : null}
        {inRemoveMode ? <ItemRemove onConfirmRemove={onConfirmRemove} onCancelRemove={onCancelRemove} selectedItems={removeSelected} /> : null}
    </div>

    {/* // listItems.map((itemData, index) => <ListItem />) */}

    {/* // This button should allow the user to add an item. This will either add the item in the textbox or open up a textbox. */}
    </>
  )
}

export default TheList