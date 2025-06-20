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
    <div className='form-container'>
      
        <h2 className='text-center mb-4'>Sign Up</h2>
        {error && <p className='error-message text-center mb-3'>{error}</p>}
        <form className='auth-form' onSubmit={handleFormSubmit}>
          <div className='form-group'>
            <label htmlFor='userEmail' className='form-label visually-hidden'>Email Address</label>
            <input 
              id='userEmail'
              className='form-control'
              onChange={handleEmailChange} 
              type='email' 
              placeholder='Your email...' 
              value={userEmail} 
              disabled={loading}
              required 
            />
          </div>
          <div className='form-group'>
            <label htmlFor='userPassword' className='form-label visually-hidden'>Password</label>
            <input 
              id='userPassword'
              className='form-control'
              onChange={handlePasswordChange} 
              type="password" 
              value={password}
              disabled={loading} 
              required />
          </div>
          <div className='form-group'>
            <label htmlFor='confirmPassword' className='form-label visually-hidden'>Confirm Password</label>
            <input 
              id='confirmPassword'
              className='form-control'
              onChange={handleConfirmPasswordChange} 
              type="password" 
              value={confirmPassword} 
              disabled={loading}
              required 
            />
          </div>
            
          <button type="submit" className='btn btn-primary w-100' disabled={loading}>
            {loading ? (
              <>
                <span className='spinner' role='status' aria-hidden="true"></span>
                Signing up...
              </>
            ) : "Sign Up"}
          </button>
        </form>
        <p className='text-center mt-3'>Already have an account? Go back to <Link to='/login' className='link-primary' >Login</Link> page!</p>
    </div>
  )
}

export default SignUpScreen