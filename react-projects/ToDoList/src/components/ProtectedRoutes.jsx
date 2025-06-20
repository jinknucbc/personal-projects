import React from 'react'
import { useAuth } from './AuthContext'
import { Navigate, Outlet } from 'react-router-dom'
import Header from './Header'
import { ContextProvider } from './ListContext'

function ProtectedRoutes() {
    const {user, loading} = useAuth()
    //   console.log("ProtectedRoute rendered. User:", !!user, "Loading:", loading, "Current URL:", window.location.pathname);


    if (loading) {
        // console.log("ProtectedRoute: Showing Loading text.");
        return <>
            <div className="loading">
                <p>Loading...</p>
            </div>
        </>
    }

    if (!user) {
        // console.log("ProtectedRoute: User NOT logged in. Redirecting to /login.");
        return <Navigate to="/login" replace />
    }
//   console.log("ProtectedRoute: User logged in. Rendering Outlet.");

  return (
  <>
    <Header />
    <ContextProvider>
        <Outlet />
    </ContextProvider>
    
  </>
  )
  
}

export default ProtectedRoutes