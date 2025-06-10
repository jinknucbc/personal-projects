import React, {useRef, useEffect, useState, useContext} from 'react'
import ListItem from './ListItem'
import ItemEdit from './ItemEdit'
import ItemRemove from './ItemRemove'
import { useNavigate, useParams } from 'react-router-dom'
import {ContextContainer} from "./ListContext"
import { useAuth } from './AuthContext'

function TheList({isNew}) {

    // List items should be stored in an array here
    const [userText, setUserText] = useState("")
    // const [listItems, setListItems] = useState([])
    const [selectItem, setSelectItem] = useState(null)
    const [inEditMode, setInEditMode] = useState(false)
    const [canSelect, setCanSelect] = useState(false)
    const [inRemoveMode, setInRemoveMode] = useState(false)
    const [removeSelected, setRemoveSelected] = useState([])
    const listContainer = useRef(null)
    const [currentList, setCurrentList] = useState(null)
    const {id} = useParams()
    const {onCreateList, listArray, setListArray, updateList, fetchLists, removeItems, removeAllListItems} = useContext(ContextContainer)
    const {user} = useAuth()
    const nav = useNavigate();

    useEffect(() => {
        
        const handleOutSideClick = (event) => {
            if (canSelect && listContainer.current && !listContainer.current.contains(event.target)) {
                setCanSelect(false)
                setInEditMode(false)
                setInRemoveMode(false)
                setSelectItem(null)
                setRemoveSelected([])
            }
        }
        document.addEventListener("mousedown", handleOutSideClick)

        return () => {document.removeEventListener("mousedown", handleOutSideClick)}
    }, [canSelect, listContainer, setCanSelect, setInEditMode, setInRemoveMode, setSelectItem, setRemoveSelected])

    useEffect(() => {
        if (isNew) {
            setCurrentList({
                id: id,
                title: "New List",
                content: []
            })
        } else {
            const fetchList = listArray.find((lists) => lists.id === id)
            if (fetchList) {
                setCurrentList(fetchList)
            }
        }
    }, [id, isNew])

    const onChange = (event) => {
        setUserText(event.target.value)
    }

   const addHandler = () => {
    if (userText.trim() !== '') {
        const itemToAdd = {
            itemId: crypto.randomUUID(),
            itemText: userText,
        }
        setCurrentList((prevList) => ({...prevList, content: [...prevList.content, itemToAdd]}))
        setUserText('')
    }
   }

   const editHandler = () => {
    if (!canSelect) {
        setCanSelect(!canSelect)
    }
    setInEditMode(!inEditMode)

   }

   const removeHandler = () => {

    if (!inRemoveMode) {
        setInRemoveMode(!inRemoveMode)
    }
    if (!canSelect) {
        setCanSelect(!canSelect)
    }

   }

   const onConfirmRemove = async () => {

    if (!user || !user.uid) {
        throw new Error("Invalid user!")
        return
    }

    if (!removeSelected || removeSelected.length === 0) {
        throw new Error("There's no item to delete.")
        return
    }

    try {
        setCurrentList((prevList) => ({...prevList, content: prevList.content.filter((item) => !removeSelected.includes(item.itemId))}))

        await removeItems(user.uid, id, removeSelected)

        setListArray((oldLists) => 
            oldLists.map((list) => 
                list.id === id ? {...list, content: list.content.filter((item) => !removeSelected.includes(item.itemId))} : list
                    
                
            )
        )
    } catch (error) {
        throw error
    } finally {
        setRemoveSelected([])
        setInRemoveMode(false)
        setCanSelect(false)
    }
   }

   const onCancelRemove = () => {
    setRemoveSelected([])
    setInRemoveMode(false)
    setCanSelect(false)
    setSelectItem(null)
   }

   const handleItemClick = (item) => {
    
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
            setRemoveSelected([...removeSelected, item.itemId])
        } else {
            setRemoveSelected(removeSelected.filter((element) => {return element !== item.itemId}))
        }
    }
    else {
        setSelectItem(null)
    }

   }

   const onSaveEdit = async (editedItem) => {    
    if (!user || !user.uid || !currentList) {
        throw new Error("User or the list is not available. Couldn't save the edit.")
    }
    try {
        const updatedList = currentList.content.map((itemObj) => {
            return itemObj.itemId === editedItem.itemId ? editedItem : itemObj
        })
        setCurrentList((prevList) => ({...prevList, content: updatedList}))
        setListArray((oldLists) => 
            oldLists.map((list) => {
                if (list.id === id) {
                    return {...list, content: updatedList}
                }
                return list
            })
        )
        await updateList(id, {...currentList, content: updatedList})
    } catch (error) {
        throw error
    } finally {
        setSelectItem(null)
        setCanSelect(false)
        setInEditMode(false)
    }    
   }

   const onCancelEdit = () => {
    setCanSelect(false)
    setInEditMode(false)
    setSelectItem(null)
    setRemoveSelected([])
   }

   const handleFinish = () => {
    if (isNew) {
        onCreateList(currentList)
    } else {
        updateList(id, currentList)
        nav("/main-screen")
    }
   }

   const handleChangeTitle = (e) => {
    setCurrentList({...currentList, title: e.target.value })
   }

   const removeAllHandler = () => {
    removeAllListItems(user.uid, id)
    setCurrentList((prevList) => ({...prevList, content: []}))
    setListArray((prevList) => 
        prevList.map((list) => {
            if (list.id === id) {
                return {...list, content: []}
            }
            return list
        })
    )
   }

   if (!currentList) {
    return <div>Creating a list...</div>
   }

  return (
    <>
    <div ref={listContainer} style={{border: "solid"}} >
        <div>
            <h2>{currentList.title}</h2>
            <input type="text" placeholder='Title' value={currentList.title} onChange={handleChangeTitle} />
        </div>
        <div>
            <textarea onChange={onChange} value={userText} placeholder='Type something'></textarea>
            {currentList.content && currentList.content.map((itemData, index) => <ListItem itemData={itemData} key={itemData.itemId ? itemData.itemId : itemData.clientId} onClick={canSelect ? handleItemClick : null} canSelect={canSelect} />)}
        </div>
        <button onClick={addHandler} disabled={canSelect}>Add</button> 
        <button onClick={editHandler} disabled={currentList.content.length === 0}>Edit</button>
        <button onClick={removeHandler} disabled={currentList.content.length === 0}>Remove</button>
        <button onClick={removeAllHandler} disabled={currentList.content.length === 0}>Remove All</button>
        <button onClick={handleFinish}>Finish</button>

        {inEditMode && selectItem ? <ItemEdit currItem={selectItem} onSaveEdit={onSaveEdit} onCancelEdit={onCancelEdit} /> : null}
        {inRemoveMode ? <ItemRemove onConfirmRemove={onConfirmRemove} onCancelRemove={onCancelRemove} selectedItems={removeSelected} /> : null}
    </div>
    </>
  )
}

export default TheList