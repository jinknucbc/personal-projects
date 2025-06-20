import React, { useState, useEffect } from 'react'
import { useRef } from 'react'

function ItemEdit({currItem, onSaveEdit, onCancelEdit}) {
    const [newText, setNewText] = useState(currItem.itemText)
    const textAreaRef = useRef(null)

    useEffect(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus()
        textAreaRef.current.setSelectionRange(newText.length, newText.length)
      }
    }, [])

    const handleChange = (event) => {
      setNewText(event.target.value)
    }

    const handleSave = () => {
      if (newText.trim() === "") {
        alert("New text can't be empty!")
        return
      }
      const updatedItem = {
        ...currItem,
        itemText: newText.trim()
      }
      onSaveEdit(updatedItem)
      setNewText("")
    }

    const handleCancel = () => {
      onCancelEdit()
    }

  return (
    <div className='modal-overlay'>
      <div className='edit-modal'>
        <h3>Edit Items</h3>
        
        <div className="form-group">
          <label htmlFor='editItem' className='form-label visually-hidden'>Change of mind?</label>
          <textarea 
            onChange={handleChange}
            ref={textAreaRef} 
            value={newText}
            id='editItem'
            className='form-control'
            rows="4"
            placeholder='Type new text...'
          ></textarea>
        </div>
        <div className="button-group">
          <button className='btn-success' onClick={handleSave}>Save</button>
          <button className='btn-secondary' onClick={handleCancel}>Cancel</button> 
        </div>
      </div>
    </div>
  )
}

export default ItemEdit