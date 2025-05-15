import React, { useRef } from 'react'

function ListCard({listKey, listTitle, contentArray, 
  onOpen, onListToRemove, enableRemove, isInSelectMode, isInRemoveMode}) {

    const holdTimer = useRef(null)
    const isHolding = useRef(false)

    const timeToHold = 1500

  // This component should show the summary of each list, and there will be more than one card displayed.
  // What that means is we'll need a component that calls on this. Basically, this is responsible for what
  // goes inside each of the small "boxes" that represent the lists.
  // In order to make that happen, what we can do is receive maximum of three list item things or so, or set some kind
  // of limit measure, from the actual list and display it here. When the user clicks the card, however, it should redirect
  // them to the actual list itself where they can add, edit, or remove items of that list.
  // console.log("We here now")

  // useEffect(() => {
  //   contentArray.map((listObj) => {listObj.map((item) => {
  //     console.log(item.text)
  //     setItemText((prevItem) => [
  //       ...prevItem, item.text
  //     ])
  //   })})

  // }, contentArray)

  // const handleOnOpen = () => {
  //   onOpen(listKey)
  // }

  const handleMouseDown = () => {
    isHolding.current = true;
    holdTimer.current = setTimeout(() => {
      // console.log("Yeah it's working")
      if (isHolding.current) {
        enableRemove()
      }
    }, timeToHold)
  }

  const handleMouseUp = () => {
    // console.log("Mouse is officially up")
    // We need to check if the time held is less than the designated time. If it is, then we'll clear the timeout and open that list.
    isHolding.current = false
    if (holdTimer.current && holdTimer.current < timeToHold && !isInRemoveMode) {
      // console.log(holdTimer.current)
      clearTimeout(holdTimer.current)
      onOpen(listKey)
    }
    clearTimeout(holdTimer.current)
    holdTimer.current = null
  }

  const onClickList = () => {
    if (isInSelectMode) {
      onListToRemove(listKey)
    }
  }

  return (
    <>
    <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onClick={onClickList} style={{border: "dashed"}}>
      {listTitle}
      {/* {console.log(itemText)} */}
      <div>
        {/* {contentArray.map((item) => console.log(item))} */}
        {contentArray.map((listItem, index) => {
          if (index < 3) {
            return <ul key={index}>{listItem.text}</ul>
          }
        })}
      </div>
    </div>
    </>
  )
}

export default ListCard