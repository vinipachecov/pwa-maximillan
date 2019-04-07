var CACHE_STATIC_NAME = 'static-v3'
var CACHE_DYNAMIC_NAME = 'dynamic-v1';
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

self.addEventListener('install', function(event) {
  event.waitUntil(
    // opens a previous cache or a new one
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll(STATIC_FILES)
      })
  )
})

self.addEventListener('activate', function(event) {
  //cache cleanUp
  event.waitUntil(
    caches.keys()
      .then(function(keyList){
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        }))

      })
  )
});

// network first and then cache - till last step
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {          
          return fetch(event.request)
          // response from the server
            .then(function(res) {
              // store in dynamic cache
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  // remember to use put!                  
                  cache.put(event.request.url, res.clone())
                  return res;
                })
            })
            .catch(function(err) {
              console.log('request failed');
            })
        }        
      })
  )
})