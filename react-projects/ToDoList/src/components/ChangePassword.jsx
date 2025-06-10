import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from '../firebaseConfig'

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const { user } = useAuth()    

    const handleCurrentPassword = (e) => {
        setCurrentPassword(e.target.value)
    }

    const handleNewPassword = (e) => {
        setNewPassword(e.target.value)
    }

    const handleConfirmNewPassword = (e) => {
        setConfirmNewPassword(e.target.value)
    }

    const handlePasswordChange = async (event) => {
        event.preventDefault()

        if (!user) {
            setError("Invalid user.")
            return
        }

        if (newPassword !== confirmNewPassword) {
            setError("Passwords must match!")
            return
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword)
            await reauthenticateWithCredential(user, credential)

            await updatePassword(user, newPassword)

            setCurrentPassword("")
            setNewPassword("")
            setConfirmNewPassword("")
        } catch (error) {
            console.log(error)
            if (error.code === "auth/invalid-credential") {
                setError("Current password is incorrect.")
            } else {
                setError(error.message)
            }
        }
    }
  return (
    
    <div>
        {error && <p>{error}</p>}
        <form onSubmit={handlePasswordChange}>
            <input type="password" onChange={handleCurrentPassword} value={currentPassword} placeholder='Your current password...' required />
            <input type="password" onChange={handleNewPassword} value={newPassword} placeholder='Your new password...' required />
            <input type="password" onChange={handleConfirmNewPassword} value={confirmNewPassword} placeholder='Confirm new password' required />
            <button type="submit" >Change Password</button>
        </form>
    </div>
    
  )
}

export default ChangePassword