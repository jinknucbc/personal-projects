import React from 'react'

function ListItem({
  itemData, 
  onClick, 
  canSelect,
  isInEditMode,
  isInRemoveMode,
  isSelected,
  isRemovalSelected
}) {
  // console.log(itemData)

    /* 
        Actually, I've moved the Edit and Remove buttons to "TheList" component as well, because I don't want to have multiple buttons
        and would rather have single instances of those buttons. Once clicked, it would ask the user to select a specific item to either
        edit or delete.

        So, now, this component should be receiving the data from listItems array that is defined in TheList.jsx
    */
   const clickHandler = () => {
    if (canSelect) {
    onClick({
      itemId: itemData.itemId,
      itemText: itemData.itemText
    })
    }
  }

  const styleClasses = [
    'list-item',
    isSelected ? "selected" : "",
    isRemovalSelected ? "selected-for-removal" : "" 
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={styleClasses}
      style={canSelect ? {cursor: "pointer"} : {}}
    >
      <div>
        <ul onClick={clickHandler}>
          {itemData.itemText}
        </ul>
      </div>
      {isInRemoveMode  && canSelect && (
        <span className='remove-icon'>X</span>
      )}
    </div>
    
    // 
  )
}

export default ListItem