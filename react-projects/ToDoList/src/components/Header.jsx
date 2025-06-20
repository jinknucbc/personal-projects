import React, { useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const ProfileImage = ({onClick}) => (
  <div className="profile-icon" onClick={onClick}>
    👤
  </div>
)

function Header() {
  // This component should have that icon that's clickable that, once clicked, will open a dropdown-style menu.

  const { user, userLogout } = useAuth()
  const nav = useNavigate()
  const loc=  useLocation()
  const [showDropdown, setShowDropdown] = useState(false)
  const menuRef = useRef(null)

  const isInMainScreen = loc.pathname === "/main-screen"

  const handleProfileClick = () => {
    setShowDropdown((prev) => !prev)
  }

  const toManageAccount = () => {
    setShowDropdown(false)
    nav("/user-account")
  }

  const handleLogout = async () => {
    try {
      await userLogout()
      setShowDropdown(false)
      nav("/login")
    } catch (error) {
      throw error
    }
  }

  return (
    <header className='header'>
      <div>
        <Link to={"/main-screen"} className='link-primary' >To Do List</Link>
      </div>
      <nav className="nav">
        { user ? (
          <>
          {!isInMainScreen && (
            <Link to={"/main-screen"} className='link-primary' >Back to Lists</Link>
          )}
          <div className='profile-container' ref={menuRef}>
            <ProfileImage onClick={handleProfileClick} />
            { showDropdown && (
              <div className="dropdown-menu">
                <p>Email: {user.email}</p>
                <button onClick={toManageAccount} >Manage Account</button>
                <button onClick={handleLogout} >Logout</button>
              </div>
            ) }
          </div>
          </>
        ) : (
          <div>
            <Link to={"/login"} className='link-primary' >Login</Link>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header