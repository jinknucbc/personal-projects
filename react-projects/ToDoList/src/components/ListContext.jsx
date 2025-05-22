import React, { createContext, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userCreateList, getUserList, updateUserList, deleteUserList, getListItems } from '../services/database';
import { auth } from '../firebaseConfig';

export const ContextContainer = createContext();

export const ContextProvider = ({children}) => {
    const [listArray, setListArray] = useState([])
    // Array of all the lists should be accessible in multiple components.
    // The structure of this array is as follows: list ID, title, content array which holds the item objects associated with a particular list.
    // Meaning, as long as a component has access to "listArray" here, it'll have access to each and every list's ID.
    const nav = useNavigate();

    const onCreateList = useCallback((newList) => {
        // Keep in mind, this will be called after "Finish" button has been pressed.
        // Once everything's confirmed, add the new list to the overall array and take the
        // user back to the main screen. Also, this "newList" already has listId, title, and content array.
        // console.log("Check check")
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
        // Probably could use the list ID here so we can apply the change only to the list that has matching ID.
        // Right now, it is updating every item in every list.
        // console.log(newContent) // newContent is an array of item objects
        listArray.map((listObj) => {
            if (listObj.id === listId) {
                console.log(listObj.id)
                console.log(listObj)
                listObj.title = updatedList.title
                listObj.content = updatedList.content
            }
        })
        updateUserList(auth.currentUser.uid, listId, updatedList)
        // console.log(listArray)
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
        } catch (error) {
            throw error
        }
    }, [getUserList, getListItems])

    const contextValue = {
        // Actual things that will be sent out to child components
        listArray: listArray,
        setListArray: setListArray,
        onCreateList: onCreateList,
        updateList: updateList,
        fetchLists: fetchLists,
    }

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