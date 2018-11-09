
var dbPromise = idb.open('posts-store', 1, function(db) {	
	if (!db.objectStoreNames.contains('posts')) {
		db.createObjectStore('posts', { keyPath: 'id'})
	}	
});

/**
 * Write to a specific objectStore in the indexDB
 * @param {*} st 
 * @param {*} data 
 */
function writeData(st, data) {
   return dbPromise
    .then(function(db) {
        // write some data to the database

        // create a transaction
        var tx = db.transaction(st, 'readwrite');
        var store = tx.objectStore(st);
        store.put(data);
        return tx.complete;
    });									
}

/**
 * Read data from the indexDB from a specific objectStore
 * @param {*} st 
 */
function readAllData(st) {
    return dbPromise
    .then(function(db) {
        // read some data to the database

        // create a transaction
        var tx = db.transaction(st, 'readonly');
        var store = tx.objectStore(st);
        return store.getAll();        
    });				
}

function clearAllData(st) {
    console.log('excluindo dados... do ', st);
    return dbPromise
        .then(function(db) {
            var tx = db.transaction(st, 'readwrite');
            var store = tx.objectStore(st);
            // as clear is a writing function
            // we need to return complete
            store.clear();
            return tx.complete;
        })
}

function deleteItemFromData(st, id) {
    return dbPromise
        .then(function(db) {
            var tx = db.transaction(st, 'readwrite');
            var store = tx.objectStore(st);
            store.delete(id);
            return tx.complete;
        })        
}