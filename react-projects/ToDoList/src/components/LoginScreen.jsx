import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {auth} from "../firebaseConfig"
import { signInWithEmailAndPassword } from 'firebase/auth'


function LoginScreen() {
    const [userEmail, setUserEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const nav = useNavigate()

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await signInWithEmailAndPassword(auth, userEmail, password)
            nav("/")
        } catch (error) {
            setError(error)
        }
    }

    const handleEmailChange = (e) => {
        setUserEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

  return (
    <div>
        <form onSubmit={handleLoginSubmit}>
            <input onChange={handleEmailChange} type='email' placeholder='Type your email' value={userEmail}></input>
            <input onChange={handlePasswordChange} type={showPassword ? 'text' : 'password'} value={password}></input><button onClick={(e) => {setShowPassword(!showPassword)}} type='check'>Show Password</button>
            <button type='submit'>Login</button>
        </form>
        
    </div>
  )
}

export default LoginScreen