import React from 'react'

function ItemRemove({onConfirmRemove, onCancelRemove, selectedItems}) {
    const handleConfirm = () => {
        onConfirmRemove()
    }

    const handleCancel = () => {
        onCancelRemove()
    }

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <div className="modal-header">
          <h3 className='modal-title'>Remove Items</h3>
          <button className='modal-close-btn' onClick={handleCancel}>&times;</button>
        </div>
        <div className='modal-body'>
          <p>Are you sure you want to remove {selectedItems.length} items?</p>
        </div>
        <div className='modal-footer'>
          <button 
            className='btn-danger' 
            onClick={handleConfirm} 
            disabled={selectedItems.length === 0} 
          >
            Confirm {selectedItems.length}
          </button>
          <button 
            className='btn-secondary' 
            onClick={handleCancel} 
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemRemove