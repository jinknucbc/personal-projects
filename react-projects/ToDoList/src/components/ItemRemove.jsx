import React from 'react'

function ItemRemove({onConfirmRemove, onCancelRemove}) {
    const handleConfirm = () => {
        onConfirmRemove()
    }

    const handleCancel = () => {
        onCancelRemove()
    }

  return (
    <div>
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={handleCancel}>Cancel</button>
    </div>
  )
}

export default ItemRemove