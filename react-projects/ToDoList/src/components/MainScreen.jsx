import React, { useState, useContext, useRef, useEffect } from 'react'
import ListCard from "../components/ListCard"
import { useNavigate } from 'react-router-dom'
import { useListContext } from './ListContext'
import { auth } from '../firebaseConfig'
import { useAuth } from './AuthContext'

function MainScreen() {
  // This main screen will need access to the array of lists, at least the short version of them.
  // This is where list cards will be displayed.

  // const {listArray, setListArray, fetchLists, refreshCounter, removeList, removeAllLists} = useContext(ContextContainer)
  const {listArray, setListArray, fetchLists, refreshCounter, removeList, removeAllLists} = useListContext()

  // This is likely to be an array of objects containing the ID of the array and the contents.

  const {user, userLogout} = useAuth()

  // const [listPreview, setListPreview] = useState([])
  const [canSelect, setCanSelect] = useState(false)
  // const [inEditMode, setInEditMode] = useState(false)
  const [inRemoveMode, setInRemoveMode] = useState(false)
  const [removeSelected, setRemoveSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const cardContainer = useRef(null)

  const nav = useNavigate()

  useEffect(() => {
    // Fetch the lists from database
    // const fetchedLists = getUserList(auth.currentUser.uid)
    
    const fetchData = async () => {
      setLoading(true)
      const userId = auth.currentUser?.uid
      if (userId) {
        try {
          await fetchLists(auth.currentUser.uid)
        } catch (error) {
          throw error
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
        throw new Error("There was an error fetching data.")
      }
    }
    fetchData()
  }, [fetchLists, auth.currentUser?.uid, refreshCounter])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cardContainer.current && canSelect && !cardContainer.current.contains(event.target))
      {
        setRemoveSelected([])
        setInRemoveMode(false)
        setCanSelect(false)
      }
    }
    if (inRemoveMode) {
      document.addEventListener("mouseup", handleOutsideClick)
      return () => {document.removeEventListener("mouseup", handleOutsideClick)}
    }
  }, [cardContainer, removeSelected])


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

  const handleOpen = (listId) => {
    // Now, this function needs to know to which list it should navigate the user, and the way to do that is, since we have context
    // and navigation paths defined using key/ID of lists, to have this function receive the list key/ID from "ListCard.jsx". The reason
    // we don't want to use "newID" as shown above is we're opening a list that's already been created, so it's not new. This function will
    // need to be passed to "ListCard" so that it can be called from that component.
    // console.log(listId)
    nav(`/list/${listId}/edit`)
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

  const handleListToRemove = (listId) => {
    if (inRemoveMode) {
      // console.log("Are we here?")
      setRemoveSelected((prevLists) => {
        if (prevLists.includes(listId)) {
          // console.log(`${listKey} has been removed from remove array.`)
          return prevLists.filter(listId => listId !== listId)
        } else {
          return [...prevLists, listId]
        }
      })
      // console.log(removeSelected)
    } else {
      nav(`list/${listId}/edit`)
    }
  }

  // So, now we can confirm that mouseDown, mouseUp, and click are all somewhat working. ID of list to be removed gets added to the array.
  // What we now need is a "Confirm" button for list card removal which should run the filter method on "listArray". That change in context
  // should cause re-rendering automatically, so this component should reflect that change.

  const handleRemoveConfirm = () => {
    setListArray(listArray.filter((listObj) => !removeSelected.includes(listObj.id)))
    removeList(auth.currentUser.uid, removeSelected)
  }

  const handleDeleteAllLists = () => {
    removeAllLists(user.uid)
  }

  const handleLogout = async () => {
    try {
      await userLogout()
    } catch (error) {
      throw error
    }
  }

  return (
    <>
      <div ref={cardContainer} style={{border: "dotted", borderColor: "blue"}}>
        {/* 
          Some kind of loop over the list array and call "ListCard" in it. This list array, then, will have to contain
          either the short version of each list or the actual list object. This array would have to be updated each time
          a new list is created or an existing one is either edited or deleted. We'll be needing a "useEffect" hook so that
          we can have conditional re-rendering.
        */}
        <div style={{borderColor: "red", border: "solid"}}>
          {listArray.length > 0 ? listArray.map((list) => <ListCard key={list.id} isInSelectMode={canSelect} onOpen={handleOpen} onListToRemove={handleListToRemove} enableRemove={activateRemoveMode} isInRemoveMode={inRemoveMode} listId={list.id} listTitle={list.title} contentArray={list.content} />) : null}
        </div>
        <button onClick={handleCreate} disabled={canSelect}>Create</button>
        {/* <button onClick={handleEdit} disabled={listArray.length === 0}>Edit</button> */}
        {/* <button disabled={listArray.length === 0}>Remove</button> */}
        <button disabled={removeSelected.length === 0} onClick={handleRemoveConfirm}>Remove</button>
        <button disabled={listArray.length === 0} onClick={handleDeleteAllLists}>Remove all lists</button>
          {/* {console.log(listArray)} */}
          {user ? <button onClick={handleLogout}>Logout</button> : null}
      </div>
    </>
    
  )
}

// const MainScreen = () => {
//   console.log("MainScreen component rendered!");
//   return (
//     <div>
//       <h1>Welcome to the Main Screen!</h1>
//       <p>If you see this, MainScreen is rendering.</p>
//     </div>
//   );
// };

export default MainScreen