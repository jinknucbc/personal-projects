import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userCreateList, getUserList, updateUserList, deleteUserList, getListItems, removeListItems } from '../services/database';
import { auth } from '../firebaseConfig';

export const ContextContainer = createContext();
export const useListContext = () => useContext(ContextContainer)

export const ContextProvider = ({children}) => {
    const [listArray, setListArray] = useState([])
    const [listItems, setListItems] = useState([])
    // Array of all the lists should be accessible in multiple components.
    // The structure of this array is as follows: list ID, title, content array which holds the item objects associated with a particular list.
    // Meaning, as long as a component has access to "listArray" here, it'll have access to each and every list's ID.
    const [refreshCounter, setRefreshCounter] = useState(0)
    const nav = useNavigate();

    const triggerRefresh = useCallback(() => {
        setRefreshCounter((prev) => prev + 1 )
    })

    const onCreateList = useCallback((newList) => {
        // Keep in mind, this will be called after "Finish" button has been pressed.
        // Once everything's confirmed, add the new list to the overall array and take the
        // user back to the main screen. Also, this "newList" already has listId, title, and content array.
        // console.log("Check check")
        const listId = userCreateList(auth.currentUser.uid, newList)
        // console.log(listArray)
        setListArray((oldLists) => 
            oldLists.map((list) => {
                if (list.id === newList.id) {
                    return {...list, id: listId, }
                }
                return list
            })
        )

        nav("/")
    }, [nav, setListArray])

    const updateList = useCallback((listId, updatedList) => {
        // Probably could use the list ID here so we can apply the change only to the list that has matching ID.
        // Right now, it is updating every item in every list.
        // console.log(newContent) // newContent is an array of item objects
        // listArray.map((listObj) => {
        //     if (listObj.id === listId) {
        //         // console.log(listObj.id)
        //         // console.log(listObj)
        //         listObj.title = updatedList.title
        //         listObj.content = updatedList.content
        //     }
        // })
        updateUserList(auth.currentUser.uid, listId, updatedList)
        setListArray((oldLists) => 
            oldLists.map((list) => {
                if (list.id === listId) {
                    return {...list, title: updatedList.title, content: updatedList.content}
                }
                return list
            })
        )
        // console.log(listArray)
    }, [nav, setListArray])

    const fetchLists = useCallback(async (userId) => {
        if (userId !== auth.currentUser.uid) {
            throw new Error("User ID doesn't match.")
        }
        try {
            const fetchedLists = await getUserList(userId)
            // console.log(fetchedLists)
            const listsWithItems = await Promise.all(
                fetchedLists.map(async (listObj) => {
                    const fetchedItems = await getListItems(userId, listObj.id)
                    return {...listObj, content: fetchedItems}
                })
            )
            // console.log(listsWithItems)
            setListArray(listsWithItems)
            triggerRefresh()
        } catch (error) {
            throw error
        }
    }, [getUserList, getListItems])

    const removeList = useCallback(async (userId, listIds) => {
        // This receives an array of list IDs even if it is just one.
        if (!userId) {
            throw new Error("Invalid user ID")
        }

        if (listIds) {
            deleteUserList(userId, listIds)
        }
    }, [])

    const removeItems = useCallback(async (userId, listId, itemIds) => {
        // This also receives an array of list item IDs even if it is just one.
        if (!userId) {
            throw new Error("Invalid user ID.")
        } else if (!listId) {
            throw new Error("Invalid list ID provided.")
        }
        removeListItems(userId, listId, itemIds)
    }, [])

    const contextValue = useMemo(() => ({
        // Actual things that will be sent out to child components
        listArray,
        setListArray,
        listItems,
        setListItems,
        onCreateList,
        updateList,
        fetchLists,
        refreshCounter,
        removeList,
        removeItems
    }), [listArray,
        setListArray,
        listItems,
        setListItems,
        onCreateList,
        updateList,
        fetchLists,
        refreshCounter,
        removeList,
        removeItems])

    return (
        <ContextContainer.Provider value={contextValue}>
            {children}
            {/* 
                This childComp part will be replaced by components wrapped inside this component in App.jsx
                "value" there specifies the object that each of the child component will equally have access to
            */}
        </ContextContainer.Provider>
    )
}