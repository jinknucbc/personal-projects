import React, { useState } from 'react'

function ItemEdit({currItem, onSaveEdit, onCancelEdit}) {
    const [newText, setNewText] = useState(currItem.text)
    // console.log(currItem)

    const handleChange = (event) => {
      setNewText(event.target.value)
    }

    const handleSave = () => {
      const updatedItem = {
        ...currItem,
        text: newText
      }
      onSaveEdit(updatedItem)
      setNewText("")
    }

    const handleCancel = () => {
      onCancelEdit()
    }

  return (
    <div>
        <textarea onChange={handleChange} value={newText}></textarea>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
    </div>
  )
}

export default ItemEdit