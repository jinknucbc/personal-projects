import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

function VerifyEmail() {

    const nav = useNavigate()
  return (
    <div>
        <p>A link to verify your account has been sent! Check your email!</p>
        <p>Back to <Link to="/login">Login</Link> when you're ready!</p>
    </div>
  )
}

export default VerifyEmail