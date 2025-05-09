import React, { useCallback, useEffect, useState, useContext } from 'react'
import ListCard from "../components/ListCard"
import { useNavigate } from 'react-router-dom'
import { ContextContainer } from './ListContext'

function MainScreen() {
  // This main screen will need access to the array of lists, at least the short version of them.
  // This is where list cards will be displayed.

  const {listArray} = useContext(ContextContainer)
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

  const handleOpen = () => {

  }

  // const handleEdit = () => {
  //   setInRemoveMode(false)
  //   !canSelect ? setCanSelect(true) : setCanSelect(false)
  //   !inEditMode ? setInEditMode(true) : setInEditMode(false)
  // }


  return (
    <>
      <div>
        {/* 
          Some kind of loop over the list array and call "ListCard" in it. This list array, then, will have to contain
          either the short version of each list or the actual list object. This array would have to be updated each time
          a new list is created or an existing one is either edited or deleted. We'll be needing a "useEffect" hook so that
          we can have conditional re-rendering.
        */}
        <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} style={{borderColor: "red", border: "solid"}}>
          {listArray.length > 0 ? listArray.map((list) => <ListCard key={list.key} listKey={list.key} listTitle={list.title} contentArray={list.content} />) : null}
        </div>
        <button onClick={handleCreate} disabled={canSelect}>Create</button>
        {/* <button onClick={handleEdit} disabled={listArray.length === 0}>Edit</button> */}
        <button disabled={listArray.length === 0}>Remove</button>
          {console.log(listArray)}

      </div>
    </>
    
  )
}

export default MainScreen