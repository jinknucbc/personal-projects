import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { reauthenticateWithCredential, EmailAuthProvider, deleteUser, signOut } from 'firebase/auth'
import { db, auth } from '../firebaseConfig'
import { deleteDoc, collection, doc, getDocs } from 'firebase/firestore'
import { deleteCollection } from '../services/database'

function DeleteAccount() {

  const { user } = useAuth()
  const [userPassword, setUserPassword] = useState("")
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState("")
  const [userCommit, setUserCommit] = useState(false)
  const nav = useNavigate()

  const deleteUserAccount = async () => {

    setError("")
    setIsDeleting(true)
    setMessage("")

    if (!user || !user.email) {
      setError("Invalid user information.")
      setIsDeleting(false)
      return
    }

    if (!userPassword) {
      setError("You must provide your current password to delete your account!")
      setIsDeleting(false)
      return
    }

    try {
      const userCredential = EmailAuthProvider.credential(user.email, userPassword)
      await reauthenticateWithCredential(user, userCredential)

      const userDocRef = doc(db, "users", user.uid)
      const userListsCollectionRef = collection(db, `users/${user.uid}/lists`)

      const listsSnapshot = await getDocs(userListsCollectionRef)
      const deletePromises = []

      for (const list of listsSnapshot.docs) {
        const itemCollectionRef = collection(db, `users/${user.uid}/lists/${list.id}/items`)
        await deleteCollection(itemCollectionRef)
        deletePromises.push(deleteDoc(list.ref))
      }
      await Promise.all(deletePromises)
      console.log("Everything should be deleted now...")

      await deleteDoc(userDocRef)
      console.log("User document deleted...")

      await deleteUser(user)

      await signOut(auth)
      setMessage("Your account has been deleted.")
      setUserPassword("")
      setUserCommit(false)
      setTimeout(() => {
        nav("/signup")
      }, 2000)
    } catch (error) {
      console.log("Error occurred: ", error)
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password.")
      } else if (error.code === "auth/requires-recent-login") {
        setError("Please login again before attempting to delete your account.")
      } else if (error.code === "auth/user-not-found") {
        setError("User does not exist or the account has already been deleted...")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUserCommit = () => {
    setUserCommit(true)
  }

  const handleDeleteCancel = () => {
    setUserCommit(false)
    setUserPassword("")
    setError("")
  }

  return (
    <>
      <div className="delete-confirmation">
        <h3>Delete my account</h3>
        {error && <p className="error-message">{error}</p>}
        {message && <p>{message}</p>}
        {!userCommit ? (
          <button onClick={handleUserCommit} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete Account"}</button>
        ) : (
          <div>
            <p className='warning'>This action cannot be undone. All your saved data will be lost!</p>
            <div>
              <label htmlFor='deleteAccount'>Your Current Password:</label>
              <input
                type='password'
                id='deleteAccount'
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder='Type your password...' 
                disabled={isDeleting} 
                required
              />
            </div>
            <button onClick={deleteUserAccount} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Confirm Delete"}</button>
            <button onClick={handleDeleteCancel} disabled={isDeleting}>Cancel</button>
            
          </div>

        )}
        
      </div>
    </>
  )
}

export default DeleteAccount