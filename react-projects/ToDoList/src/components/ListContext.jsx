import React, { createContext, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const ContextContainer = createContext();

export const ContextProvider = ({children}) => {
    const [listArray, setListArray] = useState([])
    // Array of all the lists should be accessible in multiple components.
    const nav = useNavigate();

    const onCreateList = useCallback((newList) => {
        // Keep in mind, this will be called after "Finish" button has been pressed.
        // Once everything's confirmed, add the new list to the overall array and take the
        // user back to the main screen.
        // console.log("Check check")
        setListArray((oldLists) => [...oldLists, newList])
        nav("/")
    }, [nav, setListArray])

    const contextValue = {
        // Actual things that will be sent out to child components
        listArray: listArray,
        onCreateList: onCreateList
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