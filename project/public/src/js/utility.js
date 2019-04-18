

/**
 * Initialize our 'posts' store
 */
let dbPromise = idb.open('post-store',1, db => {
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', {
      keyPath: 'id'
    })
  }  
});


/**
 * Writes data to the store 'posts' 
 * @param {*} data 
 */
async function writeData(data) {
  try {
    console.log('wrinting data...')
    const db = await dbPromise;
    const tx = db.transaction('posts', 'readwrite');
    const store = tx.objectStore('posts');
    store.put(data);
    await tx.complete;    
  } catch (error) {
    console.log('[writeData] error writing data ', data);    
  }  
}


/**
 * Reads all data from the store param st.
 * @param {*} st 
 */
async function readAllData(st) {
  try {
    const db = await dbPromise;
    const tx = db.transaction('posts', 'readonly');
    const store = tx.objectStore(st);
    return store.getAll();    
  } catch (error) {
    console.log('[readAllData] Error reading data', st);
  }  
}

/**
 * Deletes all data from the store st
 * @param {*} st 
 */
async function clearAllData(st) {
  try {
    const db = await dbPromise;
    const tx = db.transaction(st, 'readwrite');
    const store = tx.objectStore(st);
    store.clear();
    await tx.complete;    
  } catch (error) {
    console.log('[clearAllData] Erro clearing data from indexedDB');
  }  
}

/**
 * 
 * @param {*} st  Db store to be manipulated
 * @param {*} id  key of the data to be deleted
 */
async function deleteItemFromData(st, id) {
  try {
    const db = await dbPromise;
    const tx = db.transaction(st, 'readwrite');
    const store = tx.objectStore(st);
    store.delete(id);  
    await tx.complete();    
    console.log('item deleted', id);
  } catch (error) {
    console.log('[deleteItemFromData] error deleting item by id...');    
  }  
}