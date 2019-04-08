
var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/css/app.css',
  '/src/css/main.css',
  '/src/js/main.js',
  '/src/js/material.min.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
  'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxK.woff2',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll(STATIC_ASSETS);
      })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
});

// current strategy
// cache fallback to network
// self.addEventListener('fetch', function(event) {
//   event.respondWith(new promise((resolve, reject) => {  
//     const cacheResponse = await caches.match(event.request);
//     if (cacheResponse) {
//       resolve(respcacheResponseonse);
//     } else {
//       try {
//         const serverResponse = await fetch(event.request);        
//         const dynamicCache = await caches.open(CACHE_DYNAMIC_NAME);            
//         await dynamicCache.put(event.request.url, serverResponse.clone());
//         resolve(serverResponse);                            
//       } catch (error) {
//         console.log('network fallback');        
//       }      
//     }
//   }) 
//   );
// });

// network only
// don't have a cache strategy at all
// self.addEventListener('fetch', function(event) {
//   event.respondWith(new promise((resolve, reject) => {  
//     resolve(fetch(event.request));
//   }) 
//   );
// });

// cache only
// caches only the static assets, don't allow any dynamic caching
// self.addEventListener('fetch', function(event) {
//   console.log('fetching')
//   event.respondWith(caches.match(event.request));
// });

// network with cache fallback
// caches only the static assets 
// self.addEventListener('fetch', function(event) {
//   event.respondWith(new Promise(async (resolve, reject) => {      
//       const serverResponse = await fetch(event.request);
//       if (serverResponse) {
//         resolve(serverResponse);
//       } else {
//         resolve(caches.match(event.request))
//       }         
//     })   
//   );
// });


//cache then network
self.addEventListener('fetch', function(event) {
  event.respondWith(new Promise(async (resolve, reject) => {
    const url = 'https://httpbin.org/ip';        
    if (event.request.url.indexOf(url) > -1) {
      console.log('dinamic');
      // if dinamic content cache then network
      const dinamicCache = await caches.open(CACHE_DYNAMIC_NAME);
      const serverResponse = await fetch(event.request);
      await dinamicCache.put(event.request.url, serverResponse.clone());
      resolve(serverResponse);      
    } else if(STATIC_ASSETS.some(asset => event.request.url.indexOf(asset) > -1)) {            
      // CACHE ONLY
      resolve(caches.match(event.request));
    } else {
      // cache with network fallback
      const cacheResponse = await caches.match(event.request);
      if (cacheResponse) {
        resolve(cacheResponse);
      } else {
        resolve(fetch(event.request));
      }      
    }           
   })   
  );
});