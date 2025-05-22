import React, { useState } from 'react'

function ItemEdit({currItem, onSaveEdit, onCancelEdit}) {
    const [newText, setNewText] = useState(currItem.itemText)

    const handleChange = (event) => {
      setNewText(event.target.value)
    }

    const handleSave = () => {
      const updatedItem = {
        ...currItem,
        itemText: newText
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
        {/* 
          Well, this Cancel button probably should be visible the moment the user presses either Edit or Remove button
          well before they select an item, because they may change their mind and cancel out of that selection mode.
        */}
    </div>
  )
}

export default ItemEdit