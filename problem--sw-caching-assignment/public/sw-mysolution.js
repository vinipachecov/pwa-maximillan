
var STATIC_CACHE_NAME = 'static-v3'
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
const STATIC_FILES = [
  '/',
  '/src/js/main.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/dynamic.css',
  '/src/css/main.css',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]




// Install and activate
self.addEventListener('install', function(event) {
  console.log('[install] instalando service worker....');	
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
    .then(function(cache) {
      console.log('[Service Worker] adding static files to cache')
      cache.addAll(STATIC_FILES)
    })
  )
})

self.addEventListener('activate', function(event) {
console.log('[activate] ativando service worker...');

// check for older caches
  event.waitUntil(
    caches.keys()
    .then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        // check if the cache name is not the same of my 
        // most updated cache
        console.log('CACHE ANTIGA = ', key);
        if (key !== STATIC_CACHE_NAME && key !== CACHE_DYNAMIC_NAME) {
          console.log('[Service Worker] removing old cache: ', key);
          //actually removes the old cache
          return caches.delete(key);
        }
      }))
    })
  );
  return self.clients.claim(STATIC_CACHE_NAME);
});


//---------------------------------------------------------


//Fetching

self.addEventListener('fetch', function (event) {
	// console.log('[Service worker] fetching something ...', event);    
	// overwrite data that is sent back
	// event.respondWith(fetch(event.request))        
	//Make sure we fetch the data from our cache 
	// when available
	event.respondWith(

		// fetch first
		fetch(event.request)
		.then(function(res) {
			return caches.open(CACHE_DYNAMIC_NAME)
				.then(function(cache) {
						// put doesn't stores any request, but only the data you have
						cache.put(event.request.url, res.clone())
						return res;
				})                    
		})
		.catch(function (err) {
      // request failed 
			// check if is in the cache
			return caches.match(event.request)
		})
	);
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//   )
// });



