import React from 'react'
import { useNavigate } from 'react-router-dom'
import ManageAccount from './ManageAccount'

function UserProfile() {

    const nav = useNavigate()

    // Actually, this should allow users to go to their account setting, or "Manage Account", and that "ManageAccount" component should be where
    // the users can either change password or delete their account.

    // The flow I'm envisioning is one in which there's a header nav bar in which is an icon that represents user's profile picture. The user
    // presses it and then it opens a side nav bar whose content will be in "return" statement of this component. So, this component should likely
    // be wrapped in the header nav bar.



  return (
    <div>
        <ManageAccount />
    </div>
  )
}

export default UserProfile