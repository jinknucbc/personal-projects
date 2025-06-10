import React, { useState } from 'react'
import { auth } from '../firebaseConfig'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'

function ForgotPassword() {

  const [userEmail, setUserEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
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
    <>
    {message && <p>{message}</p>}
    {error && <p>{error}</p>}
      <div>
        <form onSubmit={handleSubmit} >
          <input type="email" placeholder='Type your email...' onChange={(e) => setUserEmail(e.target.value)} />
          <button type='submit' disabled={loading} >{loading ? "Sending email..." : "Send Reset Link"}</button>
        </form>
      </div>
      <Link to="/login" >Back to Login</Link>
    </>
    
  )
}

export default ForgotPassword