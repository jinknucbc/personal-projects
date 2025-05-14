import React, { useState, useContext } from 'react'
import ListCard from "../components/ListCard"
import { useNavigate } from 'react-router-dom'
import { ContextContainer } from './ListContext'

function MainScreen() {
  // This main screen will need access to the array of lists, at least the short version of them.
  // This is where list cards will be displayed.

  const {listArray, setListArray} = useContext(ContextContainer)
  // This is likely to be an array of objects containing the ID of the array and the contents.

  // const [listPreview, setListPreview] = useState([])
  const [canSelect, setCanSelect] = useState(false)
  // const [inEditMode, setInEditMode] = useState(false)
  const [inRemoveMode, setInRemoveMode] = useState(false)
  const [removeSelected, setRemoveSelected] = useState([])

  const nav = useNavigate()

  const handleCreate = () => {
    const newID = crypto.randomUUID()
    // const newList = {
    //   key: newID,
    //   title: "New List",
    //   content: []
    // }
    // setListArray([...listArray, newList])
    nav(`/list/${newID}/new`)
  }

  const handleOpen = (listKey) => {
    // Now, this function needs to know to which list it should navigate the user, and the way to do that is, since we have context
    // and navigation paths defined using key/ID of lists, to have this function receive the list key/ID from "ListCard.jsx". The reason
    // we don't want to use "newID" as shown above is we're opening a list that's already been created, so it's not new. This function will
    // need to be passed to "ListCard" so that it can be called from that component.
    nav(`/list/${listKey}/edit`)
  }

  // const handleEdit = () => {
  //   setInRemoveMode(false)
  //   !canSelect ? setCanSelect(true) : setCanSelect(false)
  //   !inEditMode ? setInEditMode(true) : setInEditMode(false)
  // }

  const activateRemoveMode = () => {
    setInRemoveMode((prevState) => !prevState)
    setCanSelect((prevState) => {
      if (!prevState) {
        return !prevState
      } else {
        return !prevState
      }
      })
  }

  const handleListToRemove = (listKey) => {
    if (inRemoveMode) {
      // console.log("Are we here?")
      setRemoveSelected((prevLists) => {
        if (prevLists.includes(listKey)) {
          // console.log(`${listKey} has been removed from remove array.`)
          return prevLists.filter(listId => listId !== listKey)
        } else {
          return [...prevLists, listKey]
        }
      })
      // console.log(removeSelected)
    } else {
      nav(`list/${listKey}/edit`)
    }
  }

  // So, now we can confirm that mouseDown, mouseUp, and click are all somewhat working. ID of list to be removed gets added to the array.
  // What we now need is a "Confirm" button for list card removal which should run the filter method on "listArray". That change in context
  // should cause re-rendering automatically, so this component should reflect that change.

  const handleRemoveConfirm = () => {
    setListArray(listArray.filter((listObj) => !removeSelected.includes(listObj.key)))
  }

  return (
    <>
      <div>
        {/* 
          Some kind of loop over the list array and call "ListCard" in it. This list array, then, will have to contain
          either the short version of each list or the actual list object. This array would have to be updated each time
          a new list is created or an existing one is either edited or deleted. We'll be needing a "useEffect" hook so that
          we can have conditional re-rendering.
        */}
        <div style={{borderColor: "red", border: "solid"}}>
          {listArray.length > 0 ? listArray.map((list) => <ListCard key={list.key} isInSelectMode={canSelect} onOpen={handleOpen} onListToRemove={handleListToRemove} enableRemove={activateRemoveMode} isInRemoveMode={inRemoveMode} listKey={list.key} listTitle={list.title} contentArray={list.content} />) : null}
        </div>
        <button onClick={handleCreate} disabled={canSelect}>Create</button>
        {/* <button onClick={handleEdit} disabled={listArray.length === 0}>Edit</button> */}
        {/* <button disabled={listArray.length === 0}>Remove</button> */}
        <button disabled={removeSelected.length === 0} onClick={handleRemoveConfirm}>Remove</button>
          {/* {console.log(listArray)} */}

      </div>
    </>
    
  )
}

export default MainScreen