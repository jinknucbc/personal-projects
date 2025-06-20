import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

function LoginScreen() {

    const { userLogin } = useAuth()
    const [userEmail, setUserEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const nav = useNavigate()

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await userLogin(userEmail, password)
            nav("/main-screen")
        } catch (error) {
            console.error("Error logging in: ", error)
            let errorMessage = "An unexpected error occurred!"
            switch (error.code) {
                case "auth/invalid-email":
                case "auth/user-not-found":
                case "auth/wrong-password":
                    errorMessage = "Invalid email or password."
                    break
                case "auth/too-many-requests":
                    errorMessage = "Too many attempts. Please try again later."
                    break
                case "auth/network-request-failed":
                    errorMessage = "Network error. Please make sure you have a stable connection."
                    break
                default:
                    errorMessage = error.message || "Couldn't log you in. Please make sure your credentials are correct."
            }
            setError(errorMessage) 
        } finally {
            setLoading(false)
        }
    }

    const handleEmailChange = (e) => {
        setUserEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    console.log(error)

  return (
    <div className='form-container'>
        
        <h2 className='text-center mb-4'>Login</h2>

        {error && <p className='error-message text-center mb-3'>{error}</p>}

        <form className='auth-form' onSubmit={handleLoginSubmit}>
            <div className='form-group'>
                <label htmlFor='userEmail' className='form-label visually-hidden'>Email Address</label>
                <input 
                    id='userEmail'
                    className='form-control'
                    onChange={handleEmailChange} 
                    type='email' 
                    placeholder='Type your email' 
                    value={userEmail}
                    disabled={loading}
                    required
                />
            </div>
            <div className='form-group mb-3'>
                <label htmlFor='userPassword' className='form-label visually-hidden'>Password</label>
                <div className='input-group'>
                    <input 
                        id='userPassword'
                        className='form-control'
                        onChange={handlePasswordChange} 
                        type={showPassword ? 'text' : 'password'} 
                        value={password}
                        disabled={loading}
                        required
                    />
                    <button 
                        className='btn btn-secondary password-toggle-btn'
                        onClick={() => {setShowPassword(!showPassword)}} 
                        type='button'
                        disabled={loading}
                    >
                        {showPassword ? "Hide Password" : "Show Password"}
                    </button>
                </div>
            </div>
            
            <button type='submit' className='btn btn-primary w-100 mt-2' disabled={loading}>
                {loading ? (
                    <>
                        <span className='spinner' role='status' aria-hidden="true"></span>
                        Logging you in...
                    </>
                ) : "Login"}
            </button>
        </form>
        {/* {error ? `Invalid login credentials` : null } */}
        <div className='text-center mt-3'>
            <p>
                <Link to='/forgot-password' className='link-primary' >Forgot Password?</Link>
            </p>
            <p className='mb-2'>
                No account? <Link to='/signup' className='link-primary' >Sign Up</Link>
            </p>
        </div>
        
    </div>
  )
}

export default LoginScreen