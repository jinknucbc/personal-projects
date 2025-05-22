import { db } from "../firebaseConfig"
import { collection, addDoc, doc, getDocs, deleteDoc, writeBatch, updateDoc, getDoc } from "firebase/firestore"

const userCreateList = async (userId, listData) => {
    if (!userId) {
        throw new Error("Valid User ID required.")
    }
    const listCollectionRef = collection(db, "users", userId, "lists")
    try {
        const listRef = await addDoc(listCollectionRef, {
            title: listData.title
        })
        const newListId = listRef.id

        if (listData.content && listData.content.length > 0) {
            const itemCollectionRef = collection(db, 'users', userId, 'lists', newListId, "items")
            // This probably should be a separate function of its own, honestly.

            for (const item of listData.content) {
                await addDoc(itemCollectionRef, {itemText: item.itemText})
            }
        return newListId
        }

    } catch (error) {
        throw error
    }
}

const getUserList = async (userId) => {
    if (!userId) {
        throw new Error("Invalid user ID.")
    }
    const listCollectionRef = collection(db, "users", userId, "lists")
    try {
        const querySnapshot = await getDocs(listCollectionRef)
        const listData = querySnapshot.docs.map((document) => ({"id": document.id, ...document.data()}))
        return listData
    } catch (error) {
        throw error
    }
}

const getListItems = async (userId, listId) => {
    if (!userId) {
        throw new Error("Invalid user Id.")
    }
    const itemCollectionRef = collection(db, 'users', userId, 'lists', listId, 'items')
    try {
        const querySnapshot = await getDocs(itemCollectionRef)
        const listItems = querySnapshot.docs.map((document) => ({
            "itemId": document.id,
            "itemText": document.data().itemText
        }))
        return listItems
    } catch (error) {
        throw error
    }
}

const getListAndItems = async (userId, listId) => {
    if (!userId) {
        throw new Error("Invalid user Id.")
    }
    try {
        const listDocRef = doc(db, 'users', userId, 'lists', listId)
        // console.log(listDocRef)
        const listDocSnapshot = await getDoc(listDocRef)
        // console.log(listDocSnapshot)
        // const 

        // It looks like I'm going to have to extract the listId and other list data of the particular list I'm looking for.

        // if (!listDocSnapshot.exist()) {
        //     return null
        // }

        const listData = {
            id: listDocSnapshot.id,
            ...listDocSnapshot.data()
        }

        listData.content = await getListItems(userId, listId)
        // console.log(listData)

        return listData
    } catch (error) {
        throw error
    }
}

const deleteUserList = async (userId, listIds) => {
    if (!userId) {
        throw new Error("Invalid user ID.")
    }
    const listCollectionRef = collection(db, "users", userId, "lists")
    const batch = writeBatch(db)

    try {
        listIds.forEach(listId => {
            const docRef = doc(listCollectionRef, listId)
            batch.delete(docRef)
        });
        await batch.commit()
    } catch (error) {
        throw error        
    }
}

const updateUserList = async (userId, listId, updatedList ) => {

    if (!userId) {
        throw new Error("Invalid user ID.")
    }
    // console.log("If updateUserList is causing the error, this will show.")
    const fetchedList = await getListAndItems(userId, listId)
    // console.log(fetchedList)
    // console.log(updatedList)


    const listRef = doc(db, 'users', userId, 'lists', listId)
    const itemCollectionRef = collection(db, 'users', userId, 'lists', listId, 'items')


    if (!fetchedList) {
        throw new Error("List doesn't exist!")
    }

    const batch = writeBatch(db)

    try {
        if (updatedList.title !== fetchedList.title) {
            batch.update(listRef, {title: updatedList.title})
        }

        const currentItems = new Map(fetchedList.content.map((item) => [item.itemId, item]))
        const updatedItems = new Map(updatedList.content.map((item) => [item.itemId, item]))

        // console.log(currentItems)
        // console.log(updatedItems)

        // for (const item of fetchedList.content) {
        // // This will need some work, so that it'll delete items in the current list that do not exist in the updated list.
        // // Honestly, this might be working as intended right now, just that update itself is a little funky at the moment.
        //     if (!updatedItems.has(item.itemId)) {
        //         const docRef = doc(itemCollectionRef, item.itemId)
        //         batch.delete(docRef)
        //     }
        // }

        for (const item of updatedList.content) {
            // console.log(item)
            // console.log(item[0])
            // console.log(item[1].itemText)
            // It would make sense to check if the ID of an added item exists among the current list's items. If not, then we write it into
            // batch. Another case is where the ID matches but we check if the data, in this particular case itemText, is different in which case
            // we'd also write the update to batch.
            if (currentItems.has(item.itemId)) {
                const matchingId = currentItems.get(item.itemId)
                // console.log(matchingId)
                if (matchingId.itemText !== item.itemText) {
                    const docRef = doc(itemCollectionRef, item.itemId)
                    batch.update(docRef, {itemText: matchingId.itemText})
                    // console.log(matchingId.itemText)
                    // This is the case where the item with matching ID exists but itemText is different.
                }
            } else {
                // Based on the current if-check, this should be the case when there is a new item object coming in.
                // console.log("It ain't here chief")
                batch.set(doc(itemCollectionRef), {itemText: item.itemText})
            }
        }
        await batch.commit()
        // Okay, this does work because I can see the added item in Firestore Database. However, right now, editing an existing item
        // doesn't work yet, because that is going to need a separate function before it makes it here. That other function will have
        // to work with "Save" button, so we're thinking "onSaveEdit" in "TheList.jsx". 
        // Now, something else we need to implement is actually updating (re-populating, or adding to) "listArray" so that the new/edited item
        // is visible on screen. I'm talking about right there and then, as in after clicking "Finish" and confirming the update, when the user
        // goes back to that particular list, it should display the new/edited item.
    } catch (error) {
        throw error
    }

}

const updateListItems = async (userId, listId, itemId, newItemText) => {
    if (!userId) {
        throw new Error("Invalid user ID.")
    }
    const itemCollectionRef = collection(db, 'users', userId, 'lists', listId, 'items')
    // From this collection, we'll need to get the document that has the matching "itemId", change the data which in this case is simple text
    // using updateDoc.
    // const docRef = doc(itemCollectionRef, itemId)
    // updateDoc(itemCollectionRef, {itemText: newItemText} )
}

export { userCreateList, getUserList, deleteUserList, updateUserList, getListItems}