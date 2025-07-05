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
    const [showRemovalModal, setShowRemovalModal] = useState(false)
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
                setShowRemovalModal(false)
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
            } else {
                nav("/main-screen")
            }
        }
    }, [id, isNew, listArray, nav])

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
    setInRemoveMode((prevState) => !prevState)
    setCanSelect((prevState) => !prevState)
    if (inRemoveMode) {
        setRemoveSelected([])
        setSelectItem(null)
        setInEditMode(false)
    }

   }

   const onConfirmRemove = async () => {

    if (!user || !user.uid) {
        throw new Error("Invalid user!")
    }

    if (!removeSelected || removeSelected.length === 0) {
        throw new Error("There's no item to delete.")
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
        setShowRemovalModal(false)
    }
   }

   const onCancelRemove = () => {
    setRemoveSelected([])
    setInRemoveMode(false)
    setCanSelect(false)
    setSelectItem(null)
    setShowRemovalModal(false)
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
        setShowRemovalModal(false)
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

   const removeAllHandler = async () => {

    if (currentList.length === 0) {
        alert("The list is already empty!")
        return
    }
    const confirmClear = window.confirm("Are you sure you want to delete everything?")
    if (confirmClear) {
        try {
            await removeAllListItems(user.uid, id)
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
        } catch (error) {
            console.log(error)
            alert("Couldn't clear the list. Please try again!")
        } finally {
            setCanSelect(false)
            setInEditMode(false)
            setInRemoveMode(false)
            setSelectItem(null)
            setRemoveSelected([])
            setShowRemovalModal(false)
        }
    }
    

    
   }

   const handleShowRemovalModal = () => {
    if (removeSelected.length > 0) {
        setShowRemovalModal(true)
    } else {
        alert("Select items to remove first!")
    }
   }

   if (!currentList) {
    return (
        <div className='loading'>
            <div className='spinner'></div>
            <p>Creating a list...</p>
        </div>
    )
   }

  return (
    <>
    <div className='list-detail' ref={listContainer} >
        <div className='container'>
            <div className="list-header">
                {inEditMode && selectItem ? (
                    <h2 className='list-title'>{currentList.title}</h2>
                ) : (
                    <input 
                        type="text" 
                        className='form-control list-title-input' 
                        placeholder='Title' 
                        value={currentList.title} 
                        onChange={handleChangeTitle} 
                    />
                )}
                
            </div>
            <div className='form-group mb-3'>
                <textarea 
                    className='item-input form-control' 
                    onChange={onChange} 
                    value={userText} 
                    placeholder='Type something'
                    disabled={inEditMode || inRemoveMode}
                    rows="3"
                ></textarea>
            </div>
            <div className='list-items'>
                {currentList.content && currentList.content.length > 0 ? (
                    currentList.content.map((itemData) => (
                    <ListItem 
                        itemData={itemData} 
                        key={itemData.itemId} 
                        onClick={() => handleItemClick(itemData)} 
                        canSelect={canSelect}
                        isInEditMode={inEditMode}
                        isInRemoveMode={inRemoveMode}
                        isSelected={selectItem && selectItem.itemId === itemData.itemId}
                        isRemovalSelected={removeSelected.includes(itemData.itemId)}
                    />
                    ))
                ) : (
                    <p className='info-message text-center'>The list is empty, so let's add some items!</p>
                )}
            </div>
            <div className='action-buttons mt-4'>
                <button 
                    className="btn-primary" 
                    onClick={addHandler} 
                    disabled={canSelect || userText.trim() === ''}
                >
                    Add Item
                </button> 
                <button 
                    className="btn-primary" 
                    onClick={editHandler} 
                    disabled={currentList.content.length === 0 || inRemoveMode}
                >
                    {inEditMode ? "Cancel Edit" : "Edit Item"}
                </button>
                <button 
                    className="btn-danger" 
                    onClick={removeHandler} 
                    disabled={currentList.content.length === 0 || inEditMode}
                >
                    {inRemoveMode ? "Cancel Remove" : "Remove Item"}
                </button>
                {inRemoveMode && removeSelected.length > 0 && (
                    <button
                        className='btn-danger'
                        onClick={handleShowRemovalModal}
                        disabled={removeSelected.length === 0}
                    >
                        Confirm Remove {removeSelected.length}
                    </button>
                )}
                <button 
                    className="btn-danger" 
                    onClick={removeAllHandler} 
                    disabled={currentList.content.length === 0 || inEditMode}
                >
                    Remove All
                </button>
                <button 
                    className="btn-primary" 
                    onClick={handleFinish}
                    disabled={inEditMode || inRemoveMode}
                >
                    Finish
                </button>
            </div>
            

            {inEditMode && selectItem ? (
                <ItemEdit 
                    currItem={selectItem} 
                    onSaveEdit={onSaveEdit} 
                    onCancelEdit={onCancelEdit} 
                />
            ) : null}
            {showRemovalModal && (
                <ItemRemove 
                    onConfirmRemove={onConfirmRemove} 
                    onCancelRemove={onCancelRemove} 
                    selectedItems={removeSelected} 
                />
             )}
        </div>
    </div>
    </>
  )
}

export default TheList