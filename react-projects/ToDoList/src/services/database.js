import { db } from "../firebaseConfig"
import { collection, addDoc, doc, getDocs, deleteDoc, writeBatch, updateDoc, getDoc, query } from "firebase/firestore"

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
    // const listCollectionRef = collection(db, "users", userId, "lists")
    const batch = writeBatch(db)

    for (const listId of listIds) {
        const listDocRef = doc(db, 'users', userId, 'lists', listId)
        const itemCollectionRef = collection(db, 'users', userId, 'lists', listId, 'items')
        let querySnapshot
        try {
            querySnapshot = await getDocs(itemCollectionRef)

        } catch (error) {
            continue
        }
        querySnapshot.docs.forEach(itemDoc => {
            batch.delete(itemDoc.ref)
        })
        batch.delete(listDocRef)
    }

    try {
        // listIds.forEach(listId => {
        //     const docRef = doc(listCollectionRef, listId)
        //     batch.delete(docRef)
        // });
        await batch.commit()
    } catch (error) {
        throw error        
    }
}

const deleteAllLists = async (userId) => {
    if (!userId) {
        throw new Error("Invalid user ID.")
    }

    // const batch = writeBatch(db)

    let allListsSnapshot

    try {
        const listCollectionRef = collection(db, 'users', userId, 'lists')
        // const itemCollectionRef = collection(db, 'users', userId, 'lists', listId, 'items')

        allListsSnapshot = await getDocs(listCollectionRef) // This becomes the snapshot of all the lists under this particular user

        for (const listDoc of allListsSnapshot.docs) {
            const listDocId = listDoc.id
            await deleteUserList(userId, [listDocId])
        }

    } catch (error) {
        throw error
    }
}

const deleteCollection = async (collectionRef, batchSize = 100) => {
    const collectionQuery = query(collectionRef)
    const querySnapshot = await getDocs(collectionQuery)

    if (querySnapshot.size === 0) {
        return
    }
    const deletePromise = []
    querySnapshot.docs.forEach(doc => {
        deletePromise.push(deleteDoc(doc.ref))
    })
    await Promise.all(deletePromise)

    if (querySnapshot.size === batchSize) {
        await deleteCollection(collectionRef, batchSize)
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

        for (const [itemId, itemData] of currentItems.entries()) {
            if (!updatedItems.has(itemId)) {
                const itemDocRef = doc(itemCollectionRef, itemId)
                batch.delete(itemDocRef)
            }
        }

        for (const[itemId, itemData] of updatedItems.entries()) {
            if (currentItems.has(itemId)) {
                const existingItem = currentItems.get(itemId)
                if (existingItem.itemText !== itemData.itemText) {
                    const itemDocRef = doc(itemCollectionRef, itemId)
                    batch.update(itemDocRef, {itemText: itemData.itemText})
                }
            } else {
                const newItemDocRef = doc(itemCollectionRef, itemId)
                batch.set(newItemDocRef, {itemText: itemData.itemText})
            }
        }

        await batch.commit()

    } catch (error) {
        throw error
    }

}

const removeListItems = async (userId, listId, itemIdsArray) => {
    // To delete certain items from a certain list that belongs to a certain user, we'll need the user's ID and that of the list. Because the
    // user can multi-select items to remove, we'll just pass in an array of item objects/IDs. Again, this function will be called when the user
    // presses "Confirm" button. I might add like 5-second cooldown before the deletion is actually carried out just in case the user wants
    // to undo the deletion.
    // This is likely going to be called inside "deleteUserList". Not all the time, but that's definitely one of the cases.
    // Actually, I might implement "deleteUserList" case in that function, since its job is to delete everything about that list anyway.
    // Just to clarify, "itemsArray" here refers to the array of items to be deleted.
    if (!userId || !listId || !Array.isArray(itemIdsArray)) {
        throw new Error("Invalid User ID")
    }

    const fetchedList = await getListAndItems(userId, listId)

    if (!fetchedList) {
        throw new Error("The list doesn't exist!")
    }

    // const listRef = doc(db, 'users', userId, 'lists', listId)
    const itemCollectionRef = collection(db, 'users', userId, 'lists', listId, 'items')

    const batch = writeBatch(db)

    try {
        itemIdsArray.forEach(itemId => {
            const itemDocRef = doc(itemCollectionRef, itemId)
            batch.delete(itemDocRef)
        })
        await batch.commit()
    } catch (error) {
        throw error
    }

}

const removeAllItems = async (userId, listId) => {
    if (!userId || !listId) {
        throw new Error("Invalid user or list.")
    }

    // const listDocRef = doc(db, 'users', userId, 'lists', listId)
    const itemCollectionRef = collection(db, 'users', userId, 'lists', listId, 'items')
    let itemsSnapshot

    const batch = writeBatch(db)

    try {
        itemsSnapshot = await getDocs(itemCollectionRef)
        itemsSnapshot.docs.forEach((item) => {
            console.log(item)
            batch.delete(item.ref)
        })
        await batch.commit()
    } catch (error) {
        throw error
    }

}

export { userCreateList, getUserList, deleteUserList, updateUserList, getListItems, removeListItems, deleteAllLists, removeAllItems, deleteCollection}