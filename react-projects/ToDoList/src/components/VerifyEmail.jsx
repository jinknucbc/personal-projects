import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

function VerifyEmail() {

    const nav = useNavigate()
  return (
    <div className='form-container text-center'>
      <h2 className='mb-3'>Verify Your Email</h2>
      <p className='info-message mb-2'>A link to verify your account has been sent! Check your email!</p>
      <p>Back to <Link to="/login" className='link-primary' >Login</Link> when you're ready!</p>
    </div>
  )
}

export default VerifyEmail