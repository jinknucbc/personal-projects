import React from 'react'

function ItemRemove({onConfirmRemove, onCancelRemove, selectedItems}) {
    const handleConfirm = () => {
        onConfirmRemove()
    }

    const handleCancel = () => {
        onCancelRemove()
    }

  return (
    <div>
        <button onClick={handleConfirm} disabled={selectedItems.length === 0} >Confirm</button>
        <button onClick={handleCancel} >Cancel</button>
    </div>
  )
}

export default ItemRemove