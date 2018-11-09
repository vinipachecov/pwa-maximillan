importScripts('/src/js/idb.js');
importScripts('src/js/utility.js');

var CACHE_STATIC_NAME = 'static-v16';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
var STATIC_FILES = [
	'/',
				'/index.html',
				'/offline.html',
				'/src/js/app.js',
				'/src/js/feed.js',				
				'/src/js/promise.js',
				'/src/js/fetch.js',
				'/src/js/idb.js',
				'/src/js/material.min.js',
				'/src/css/app.css',
				'/src/css/feed.css',
				'/src/images/main-image.jpg',				
				'https://fonts.googleapis.com/css?family=Roboto:400,700',
				'https://fonts.googleapis.com/icon?family=Material+Icons',
				'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]

var dbPromise = idb.open('posts-store', 1, function(db) {	
	if (!db.objectStoreNames.contains('posts')) {
		db.createObjectStore('posts', { keyPath: 'id'})
	}	
});
// function trimCache(cacheName, maxItems) {
// 	caches.open(cacheName)
// 		.then(function(cache) {
// 			return cache.keys()
// 		})
// 		.then(function(keys) {
// 			if (keys.length > maxItems) {
// 				cache.delete(keys[0])
// 					.then(trimCache(cacheName, maxItems))
// 			}
// 		})
// }

self.addEventListener('install', function (event) {
	// this event gives us info about the instalattion
	console.log('[Service Worker] installing service worker ...', event);

	// access the cache api sending a name of the resource to be cached
	event.waitUntil(
		caches.open(CACHE_STATIC_NAME)
		.then(function (cache) {
			// now we can add files to the cache
			console.log('[Service Worker] Precaching App Shell');
			// send the path to our files
			cache.addAll(STATIC_FILES)
		})
	)
})

// Fires when a new service worker is activated
self.addEventListener('activate', function (event) {
	// this event gives us info about the instalattion
	console.log('[Service Worker] activating service worker ...', event);

	//Doing some work in the caches
	event.waitUntil(
		caches.keys()
		.then(function (keyList) {
			return Promise.all(keyList.map(function (key) {
				// check if the cache name is not the same of my 
				// most updated cache
				console.log('CACHE ANTIGA = ', key);
				if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
					console.log('[Service Worker] removing old cache: ', key);
					//actually removes the old cache
					return caches.delete(key);
				}
			}))
		})
	);
	// ensure the service workers have activated
	return self.clients.claim();
})



//cache-then -network strategy
//
self.addEventListener('fetch', function (event) {	
	var url ='https://pwagram-68ff9.firebaseio.com/posts.json'	
	//parse the url
	if (event.request.url.indexOf(url) > -1) {
		event.respondWith(			
			fetch(event.request)
				.then(function(res) {							
					var clonedRes = res.clone();
					//store the transformed cloned response

					// As we are writing data to the database
					// we could delete pre-existing data in there
					// to keep everything as updated as possible
					clearAllData('posts')
					.then(function() {
						return clonedRes.json();
					})
					.then(function(data) {
						//Writing data
						for (var key in data) {
							writeData('posts', data[key])							
						}
					});								
					//Store the request in the cache
					// cache.put(event.request, res.clone());
					return res;
				})
		)
	} else if(isInArray(event.request.url, STATIC_FILES)) {
		// cache only strategy 
		// where if data is not found in the cache, it will not come here.
		event.respondWith(
				// check if is in the cache
				caches.match(event.request)
		)        
	} else {
		//cache with network fallback
		event.respondWith(		
			caches.match(event.request)
				.then(function (response) {            
						// check if we do have a valid response
						if (response) {
								return response;
						} else {
								// get something if it's not in the cache                
								return fetch(event.request)
								// response from the actual server
								.then(function(res) {
										// why not add our dynamic content?
										return caches.open(CACHE_DYNAMIC_NAME)
										.then(function(cache) {
												// trimCache(CACHE_DYNAMIC_NAME, 10)
												// put doesn't stores any request, but only the data you have
												cache.put(event.request.url, res.clone())
												return res;
										})                    
								})
								// fallback strategy
								.catch(function(err) {                   								
										return caches.open(CACHE_STATIC_NAME)
												.then(function(cache) {
														if(event.request.headers.get('accept').includes('text/html')) {
															return cache.match('/offline.html');
														}														
												});
								});
						}

				})
		)
	}
	
});


// when fetch is used in our application
// Load css
// // load images
// self.addEventListener('fetch', function(event) {
//     // console.log('[Service worker] fetching something ...', event);

//     // overwrite data that is sent back
//     // event.respondWith(fetch(event.request))        
//     //Make sure we fetch the data from our cache 
//     // when available
//     event.respondWith(
//         // check if is in the cache
//         caches.match(event.request)
//         .then(function (response) {            
//             // check if we do have a valid response
//             if (response) {
//                 return response;
//             } else {
//                 // get something if it's not in the cache                
//                 return fetch(event.request)
//                 // response from the actual server
//                 .then(function(res) {
//                     // why not add our dynamic content?
//                     return caches.open(CACHE_DYNAMIC_NAME)
//                     .then(function(cache) {
//                         // put doesn't stores any request, but only the data you have
//                         cache.put(event.request.url, res.clone())
//                         return res;
//                     })                    
//                 })
//                 .catch(function(err) {                    
//                     return caches.open(CACHE_STATIC_NAME)
//                         .then(function(cache) {
//                             return cache.match('/offline.html');
//                         });
//                 });
//             }

//         })
//     )        
// });

// // cache only
// self.addEventListener('fetch', function(event) {
//     //
//     event.respondWith(
//         // check if is in the cache
//         caches.match(event.request)
//     )        
// });

// network-only
// self.addEventListener('fetch', function(event) {
//     //
//     event.respondWith(
//         // check if is in the cache
//         // fetch(event.request)
//     )        
// });



//Network first cache
// // problem with bad quality connections
// self.addEventListener('fetch', function (event) {
// 	// console.log('[Service worker] fetching something ...', event);    
// 	// overwrite data that is sent back
// 	// event.respondWith(fetch(event.request))        
// 	//Make sure we fetch the data from our cache 
// 	// when available
// 	event.respondWith(

// 		// fetch first
// 		fetch(event.request)
// 		.then(function(res) {
// 			return caches.open(CACHE_DYNAMIC_NAME)
// 				.then(function(cache) {
// 						// put doesn't stores any request, but only the data you have
// 						cache.put(event.request.url, res.clone())
// 						return res;
// 				})                    
// 		})
// 		.catch(function (err) {
// 			// check if is in the cache
// 			return caches.match(event.request)
// 		})
// 	);
// });

function isInArray(string, array) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] === string) {
			return true
		}		
	}
	return false;
}
