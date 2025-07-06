import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { userCreateList, getUserList, updateUserList, deleteUserList, getListItems, removeListItems, deleteAllLists, removeAllItems } from '../services/database';
import { auth } from '../firebaseConfig';
import { useAuth } from './AuthContext';

export const ContextContainer = createContext();
export const useListContext = () => useContext(ContextContainer)

export const ContextProvider = ({children}) => {
        const [listArray, setListArray] = useState([])
    const [refreshCounter, setRefreshCounter] = useState(0)

    const nav = useNavigate()

    const fetchAndSetAllUserLists = useCallback(async (userId) => {
        if (!userId) {
            console.warn("Attempted to fetch lists without a valid user ID.")
            setListArray([])
            return;
        }
        try {
            const fetchedLists = await getUserList(userId)
            const listsWithItems = await Promise.all(
                fetchedLists.map(async (listObj) => {
                    const fetchedItems = await getListItems(userId, listObj.id)
                    return {...listObj, content: fetchedItems}
                })
            )
            setListArray(listsWithItems);
        } catch (error) {
            console.error("Error fetching user lists and items:", error)
            throw error
        }
    }, []); 

    const refreshLists = useCallback(async () => {
        if (auth.currentUser) {
            await fetchAndSetAllUserLists(auth.currentUser.uid)
        }
    }, [fetchAndSetAllUserLists])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                fetchAndSetAllUserLists(user.uid)
            } else {
                setListArray([])
            }
        });
        return () => unsubscribe()
    }, [fetchAndSetAllUserLists])

    const onCreateList = useCallback(async (newList) => {
        if (!auth.currentUser || !auth.currentUser.uid) {
            console.error("No authenticated user for creating list.")
            throw new Error("Authentication required.")
        }
        try {
            const newListId = await userCreateList(auth.currentUser.uid, newList)
            const createdListWithItems = await getListItems(auth.currentUser.uid, newListId)
            setListArray((oldLists) => [
                ...oldLists, 
                { ...newList, id: newListId, content: createdListWithItems || [] }
            ])
            nav("/")
        } catch (error) {
            console.error("Error creating list:", error)
            throw error;
        }
    }, [nav, setListArray, userCreateList, getListItems])

    const updateList = useCallback(async (userId, listId, updatedList) => {
        if (!userId || !listId || !updatedList) {
            console.error("Invalid arguments for updateList.")
            throw new Error("Invalid arguments provided for updating list.")
        }
        try {
            await updateUserList(userId, listId, updatedList)
        } catch (error) {
            console.error("Error updating list:", error)
            throw error;
        }
    }, [updateUserList]);

    const removeList = useCallback(async (userId, listIds) => {
        if (!userId || !listIds || listIds.length === 0) {
            throw new Error("Invalid user ID or list IDs provided for removal.")
        }
        try {
            await deleteUserList(userId, listIds);
            setListArray((prevLists) => prevLists.filter((list) => !listIds.includes(list.id)));
        } catch (error) {
            console.error("Error removing list(s):", error)
            throw error;
        }
    }, [deleteUserList, setListArray]);

    const removeAllLists = useCallback(async (userId) => {
        if (!userId) {
            throw new Error("Invalid user ID for removing all lists.")
        }
        try {
            await deleteAllLists(userId)
            setListArray([])
        } catch (error) {
            console.error("Error removing all lists:", error)
            throw error;
        }
    }, [deleteAllLists, setListArray]);

    const removeItems = useCallback(async (userId, listId, itemIds) => {
        if (!userId || !listId || !itemIds || itemIds.length === 0) {
            throw new Error("Invalid user ID, list ID, or item IDs provided for removal.")
        }
        try {
            await removeListItems(userId, listId, itemIds)
        } catch (error) {
            console.error("Error removing items:", error)
            throw error
        }
    }, [removeListItems])

    const removeAllListItems = useCallback(async (userId, listId) => {
        if (!userId || !listId) {
            throw new Error("Invalid user ID or list ID for removing all list items.")
        }
        try {
            await removeAllItems(userId, listId)
        } catch (error) {
            console.error("Error removing all items:", error)
            throw error
        }
    }, [removeAllItems]);

    const contextValue = useMemo(() => ({
        listArray,
        setListArray,
        onCreateList,
        updateList,
        removeList,
        removeItems,
        removeAllLists,
        removeAllListItems,
        refreshLists, 
    }), [
        listArray,
        setListArray,
        onCreateList,
        updateList,
        removeList,
        removeItems,
        removeAllLists,
        removeAllListItems,
        refreshLists,
    ])

    return (
        <ContextContainer.Provider value={contextValue}>
            {children}
        </ContextContainer.Provider>
    )
}