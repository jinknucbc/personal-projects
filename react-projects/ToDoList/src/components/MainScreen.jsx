import React, { useCallback, useEffect, useState } from 'react'
import ListCard from "../components/ListCard"
import { useNavigate } from 'react-router-dom'

function MainScreen() {
  // This main screen will need access to the array of lists, at least the short version of them.
  // This is where list cards will be displayed.

  const [listArray, setListArray] = useState([])
  // This is likely to be an array of objects containing the ID of the array and the contents.

  const [listPreview, setListPreview] = useState([])

  // This should change to "true" only when the user presses "Create" button


  // useEffect(() => {}, listArray)

  const nav = useNavigate()

  const handleCreate = () => {
    const newID = crypto.randomUUID()
    const newList = {
      key: newID,
      title: "New List",
      content: []
    }
    // setListArray([...listArray, newList])
    nav(`/list/${newID}/new`)
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
        <button onClick={handleCreate}>Create</button>
        <button disabled={listArray.length === 0}>Edit</button>
        <button disabled={listArray.length === 0}>Remove</button>
      </div>
    </>
    
  )
}

export default MainScreen