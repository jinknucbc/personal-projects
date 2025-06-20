import "./App.css"
import "./styles.css"
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainScreen from './components/MainScreen'
import TheList from './components/TheList'
import LoginScreen from "./components/LoginScreen"
import SignUpScreen from "./components/SignUpScreen"
import VerifyEmail from "./components/VerifyEmail"
import { AuthProvider, useAuth } from "./components/AuthContext"
import ProtectedRoutes from "./components/ProtectedRoutes"
import ManageAccount from "./components/ManageAccount"
import ChangePassword from "./components/ChangePassword"
import ForgotPassword from "./components/ForgotPassword"
import DeleteAccount from "./components/DeleteAccount"

function RedirectIfLoggedIn({children}) {
  const {user, loading} = useAuth()

  if (loading) {
    return <div>
      <p>Authenticating...</p>
    </div>
  }

  if (user && user.emailVerified) {
    return <Navigate to="/main-screen" replace />
  }

  return children

}

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
      {/* <ContextProvider> */}
        <Routes>
            <Route
            path="/login"
            element={<RedirectIfLoggedIn><LoginScreen/></RedirectIfLoggedIn>}
            />
            <Route
            path="/signup"
            element={<RedirectIfLoggedIn><SignUpScreen/></RedirectIfLoggedIn>}
            />
            <Route
            path="/verify-email"
            element={<VerifyEmail/>}
            />
            <Route 
            path="/forgot-password"
            element={<ForgotPassword />}
            />

            <Route path="/" element={<ProtectedRoutes/>}>
              <Route path="/main-screen" element={<MainScreen/> }/>
              <Route path="/list/:id" element={<TheList />} />
              <Route path="/list/:id/new" element={<TheList isNew={true} />} />
              <Route path="/list/:id/edit" element={<TheList isNew={false} />} />
              <Route index element={<Navigate to="/main-screen" replace />} />
              <Route path="/user-account" element={<ManageAccount />} />
              <Route path="/password-change" element={<ChangePassword />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
            </Route>

        </Routes>
      {/* </ContextProvider> */}
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
