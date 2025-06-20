import React, { useState } from 'react'
import { auth } from '../firebaseConfig'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'

function ForgotPassword() {

  const [userEmail, setUserEmail] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (!userEmail) {
      setError("You must provide an email associated with the account!")
      setLoading(false)
      return
    }

    try {
      await sendPasswordResetEmail(auth, userEmail)
      setMessage("If a profile exists with this email, the link will be sent to it. Please be sure to check spam folder!")
      setUserEmail("")
    } catch (error) {
      console.log("Failed to send email: ", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className='form-container'>
      <h2 className='text-center mb-4'>Reset Password</h2>
      {message && <p className='success-message text-center mb-3'>{message}</p>}
      {error && <p className='error-message text-center mb-3'>{error}</p>}
      
      <form className='auth-form' onSubmit={handleSubmit} >
        <div className='form-group'>
          <input 
            type="email" 
            placeholder='Type your email...' 
            onChange={(e) => setUserEmail(e.target.value)}
            className='form-control'
            disabled={loading}
            required 
          />
        </div>
        
        <button 
          className='btn btn-primary w-100' 
          type='submit' 
          disabled={loading} 
        >
          {loading ? (
            <>
              <span className='spinner'></span>
              Sending...
            </>
          ) : "Send Reset Link"}
        </button>
      </form>
      <div className='text-center mt-3'>
        <Link to="/login" className='link-primary' >Back to Login</Link>
      </div>
      
    </div>
    
  )
}

export default ForgotPassword