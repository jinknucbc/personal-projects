import React from 'react'

function ListCard({listKey, listTitle, contentArray}) {


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
    // onOpen(listKey)
  // } this function should be 

  return (
    <>
    <div style={{border: "dashed"}}>
      {listTitle}
      {/* {console.log(itemText)} */}
      <div>
        {/* {contentArray.map((item) => console.log(item))} */}
        {contentArray.map((listItem) => listItem.map((item, index) => {return <ul key={index}>{item.text}</ul>}) )}
      </div>
    </div>
    </>
  )
}

export default ListCard