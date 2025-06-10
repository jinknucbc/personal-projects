import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { auth } from '../firebaseConfig'
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth'

export const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    // Anything to do with authentication will all be defined here.
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [auth])

    const userLogin = useCallback( async (email, password) => {
        setLoading(true)
        setError("")
        try {
            console.log("Logging the user in...")
            await signInWithEmailAndPassword(auth, email, password)

        } catch (error) {
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }, [auth])

    const userLogout = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            await signOut(auth)
        } catch (error) {
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
        
    })

    const signUp = useCallback(async (userEmail, password) => {
        return await createUserWithEmailAndPassword(auth, userEmail, password)
    }, [])

    const sendVerification = useCallback(async (user) => {
        if (user) {
            await sendEmailVerification(user)
        } else {
            throw new Error("Couldn't send a verification email.")
        }
        
    }, [])

    const contextValue = {
        user,
        loading,
        error,
        userLogin,
        userLogout,
        signUp,
        sendVerification
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)