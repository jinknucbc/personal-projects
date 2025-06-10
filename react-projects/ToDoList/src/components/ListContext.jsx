import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userCreateList, getUserList, updateUserList, deleteUserList, getListItems, removeListItems, deleteAllLists, removeAllItems } from '../services/database';
import { auth } from '../firebaseConfig';

export const ContextContainer = createContext();
export const useListContext = () => useContext(ContextContainer)

export const ContextProvider = ({children}) => {
    const [listArray, setListArray] = useState([])
    const [listItems, setListItems] = useState([])
    const [refreshCounter, setRefreshCounter] = useState(0)
    const nav = useNavigate();

    const triggerRefresh = useCallback(() => {
        setRefreshCounter((prev) => prev + 1 )
    })

    const onCreateList = useCallback((newList) => {
        const listId = userCreateList(auth.currentUser.uid, newList)
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
        updateUserList(auth.currentUser.uid, listId, updatedList)
        setListArray((oldLists) => 
            oldLists.map((list) => {
                if (list.id === listId) {
                    return {...list, title: updatedList.title, content: updatedList.content}
                }
                return list
            })
        )
    }, [nav, setListArray])

    const fetchLists = useCallback(async (userId) => {
        if (userId !== auth.currentUser.uid) {
            throw new Error("User ID doesn't match.")
        }
        try {
            const fetchedLists = await getUserList(userId)
            const listsWithItems = await Promise.all(
                fetchedLists.map(async (listObj) => {
                    const fetchedItems = await getListItems(userId, listObj.id)
                    return {...listObj, content: fetchedItems}
                })
            )
            setListArray(listsWithItems)
            triggerRefresh()
        } catch (error) {
            throw error
        }
    }, [getUserList, getListItems])

    const removeList = useCallback(async (userId, listIds) => {
        if (!userId) {
            throw new Error("Invalid user ID")
        }

        if (listIds) {
            deleteUserList(userId, listIds)
        }
    }, [])

    const removeAllLists = useCallback(async (userId) => {
        if (!userId) {
            throw new Error("Invalid user ID")
        }

        deleteAllLists(userId)

    }, [])

    const removeItems = useCallback(async (userId, listId, itemIds) => {
        if (!userId) {
            throw new Error("Invalid user ID.")
        } else if (!listId) {
            throw new Error("Invalid list ID provided.")
        }
        removeListItems(userId, listId, itemIds)
    }, [])

    const removeAllListItems = useCallback(async (userId, listId) => {
        if (!userId || !listId) {
            throw new Error("Either user ID or list ID is invalid.")
        }
        removeAllItems(userId, listId)
    }, [])

    const contextValue = useMemo(() => ({
        listArray,
        setListArray,
        listItems,
        setListItems,
        onCreateList,
        updateList,
        fetchLists,
        refreshCounter,
        removeList,
        removeItems,
        removeAllLists,
        removeAllListItems
    }), [listArray,
        setListArray,
        listItems,
        setListItems,
        onCreateList,
        updateList,
        fetchLists,
        refreshCounter,
        removeList,
        removeItems,
        removeAllLists,
        removeAllListItems])

    return (
        <ContextContainer.Provider value={contextValue}>
            {children}
        </ContextContainer.Provider>
    )
}