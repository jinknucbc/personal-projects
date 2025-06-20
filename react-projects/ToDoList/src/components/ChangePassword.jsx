import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from '../firebaseConfig'

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [loading, setLoading] = useState(false)
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
        setError(null)
        setSuccessMessage(null)
        setLoading(true)

        if (!user) {
            setError("Invalid user. You must be logged in to change password!")
            setLoading(false)
            return
        }

        if (newPassword !== confirmNewPassword) {
            setError("Passwords must match!")
            setLoading(false)
            return
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword)
            await reauthenticateWithCredential(user, credential)

            await updatePassword(user, newPassword)

            setCurrentPassword("")
            setNewPassword("")
            setConfirmNewPassword("")
            setSuccessMessage("Password changed successfully!")
        } catch (error) {
            console.log(error)
            if (error.code === "auth/invalid-credential") {
                setError("Current password is incorrect.")
            } else {
                setError(error.message)
            }
        } finally {
            setLoading(false)
        }
    }
  return (
    
    <div className='form-container'>
        <h2 className='text-center mb-4'>
            Change Password
        </h2>
        {error && <p className='error-message text-center mb-3'>{error}</p>}
        {successMessage && <p className='success-message text-center mb-3'>{successMessage}</p>}
        <form className='auth-form' onSubmit={handlePasswordChange}>
            <div className='form-group'>
                <input 
                    type="password" 
                    onChange={handleCurrentPassword} 
                    value={currentPassword} 
                    placeholder='Your current password...'
                    className='form-control'
                    required 
                />
            </div>
            <div className='form-group'>
                <input 
                    type="password" 
                    onChange={handleNewPassword} 
                    value={newPassword} 
                    placeholder='Your new password...' 
                    className='form-control'
                    required 
                />
            </div>
            <div className='form-group'>
                <input 
                    type="password" 
                    onChange={handleConfirmNewPassword} 
                    value={confirmNewPassword} 
                    placeholder='Confirm new password' 
                    className='form-control'
                    required 
                />
            </div>
            <button 
                type="submit"
                className='btn btn-primary w-100'
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className='spinner' role='status' aria-hidden="true"></span>
                        Changing...
                    </>
                ) : ("Change Password")}
            </button>
        </form>
    </div>
    
  )
}

export default ChangePassword