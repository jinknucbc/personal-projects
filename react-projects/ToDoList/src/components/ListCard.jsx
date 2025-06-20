import React, { useRef, useEffect } from 'react'

function ListCard({listId, listTitle, contentArray, 
  onOpen, onListToRemove, enableRemove, isInSelectMode, isInRemoveMode, isSelected}) {

    const holdTimer = useRef(null)
    const isHolding = useRef(false)
    const pressTime = useRef(0)

    const timeToHold = 1500

  useEffect(() => {
    return () => {
      if (holdTimer.current) {
        clearTimeout(holdTimer.current)
      }      
    }
  }, [])

  const handleMouseDown = () => {
    pressTime.current = Date.now()
    isHolding.current = true;
    holdTimer.current = setTimeout(() => {
      if (isHolding.current) {
        enableRemove()
      }
    }, timeToHold)
  }

  const handleMouseUp = () => {
    isHolding.current = false
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
      const pressDuration = Date.now() - pressTime.current
      if (pressDuration < timeToHold) {
        if (isInSelectMode) {
          onListToRemove(listId)
        } else {
          onOpen(listId)
        }
      }
    }
  }

  const styleClasses = `
    list-card
    ${isInRemoveMode ? 'fade-in' : ''}
    ${isSelected ? 'selected-for-removal' : '' }
  `.trim()

  return (
    <>
    <div 
      className={styleClasses} 
      onMouseDown={handleMouseDown} 
      onMouseUp={handleMouseUp} 
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
    >
      <h3>{listTitle}</h3>
      <div className="list-preview">
        <ul>
          {contentArray.length === 0 && <li>There are no items in this list.</li>}
          {contentArray.map((listItem, index) => {
            if (index < 3) {
              return <li key={listItem.itemId}>{listItem.itemText}</li>
            }
            return null
          })}
        </ul>
        
      </div>
    </div>
    </>
  )
}

export default ListCard