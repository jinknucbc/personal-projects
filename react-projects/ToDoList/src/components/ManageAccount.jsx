import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

// Users would land on this page when they press "Maange Account" or whatever I'm going to call it. This right here is where
// the buttons for change password and delete account will be rendered.

function ManageAccount() {

  const nav = useNavigate()

    // When delete account button is pressed, we can have a pop-up window that asks for confirmation, telling that this can't be undone.
    // Once the confrim button is pressed, that's when we go ahead with account deletion.

    // For changing password, the button press should take the user to "ChangePassword.jsx" component.

    const ToChangePassword = () => {
        nav("/password-change")
    }

  return (
    <div className='account-management'>
        <button onClick={ToChangePassword} >Change Password</button>
        <button><Link to='/delete-account' className='link-primary' >Delete Account</Link></button>
    </div>
  )
}

export default ManageAccount