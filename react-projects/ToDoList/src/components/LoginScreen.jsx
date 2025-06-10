import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

function LoginScreen() {

    const { userLogin } = useAuth()
    const [userEmail, setUserEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const nav = useNavigate()

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await userLogin(userEmail, password)
            nav("/main-screen")
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
        {error ? `Invalid login credentials` : null }
        <p><Link to='/forgot-password' >Forgot Password?</Link></p>
        <p>No account? <Link to='/signup' >Sign Up</Link></p>
    </div>
  )
}

export default LoginScreen