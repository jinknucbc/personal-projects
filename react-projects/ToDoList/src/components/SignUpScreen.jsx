import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

function SignUpScreen() {
  const {signUp, sendVerification} = useAuth()
  const [userEmail, setUserEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const nav = useNavigate()
  
  const handleEmailChange = (e) => {
    setUserEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords must match!")
      return;
    }
    try {
      setLoading(true)
      const userInfo = await signUp(userEmail, password)

      await sendVerification(userInfo.user)
      nav("/verify-email")
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Looks like this email already has an account!")
          break
        case "auth/invalid-email":
          setError("Email address is not valid.")
          break
        case "auth/weak-password":
          setError("Password must be at least 6 characters long.")
          break
        case "auth/network-request-failed":
          setError("There seems to be a network problem!")
          break
        default:
          setError("Something went wrong! Let's try it again!")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleFormSubmit}>
        <input onChange={handleEmailChange} type='email' placeholder='Your email...' value={userEmail} required />
        <input onChange={handlePasswordChange} type="password" value={password} required />
        <input onChange={handleConfirmPasswordChange} type="password" value={confirmPassword} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? Go back to <Link to='/login'>Login</Link> page!</p>
    </div>
  )
}

export default SignUpScreen