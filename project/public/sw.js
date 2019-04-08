const DYNAMIC_CACHE = 'dynamic-v3'
const STATIC_CACHE = 'static-v2'
const STATIC_FILES = [ '/',
'/offline.html',
'./index.html',
'./src/js/app.js',
'/src/js/feed.js',
'/src/js/promise.js',
'/src/js/fetch.js',
'/src/js/material.min.js',
'/src/css/app.css',
'/src/css/feed.css',   
'/src/images/main-image.jpg',
'https://fonts.googleapis.com/css?family=Roboto:400,700',
'https://fonts.googleapis.com/icon?family=Material+Icons',
'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css']
self.addEventListener('install', function(event) {
  const preCache = async () => {
    const cache = await caches.open(STATIC_CACHE)    
    console.log('Open the cache of the service worker');
    console.log(cache);      
    cache.addAll(STATIC_FILES)                             
  } 
  event.waitUntil(preCache())
})

self.addEventListener('activate', function(event) {  
  const cleanUpCache = async () => {
    const keylist = await caches.keys();
    await Promise.all(
      keylist.map(async (key) => {
        try {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[Service worker] removing old cache', key);
            await caches.delete(key);
          }                  
        } catch (error) {
          console.log(error);          
        }        
      })
    )
  }
  event.waitUntil(cleanUpCache())
  return self.clients.claim();
})

// self.addEventListener('fetch', async function(event) {  
//   event.respondWith(new Promise(async (resolve, reject)=> {  
//     try {
//       const response = await caches.match(event.request);
//       if (response) {
//         console.log('tem');
//         resolve(response);
//       } else {
//         console.log('não tem');
//         const serverResponse = await fetch(event.request);
//         const dynamicCache = await caches.open(DYNAMIC_CACHE);
//         dynamicCache.put(event.request.url, serverResponse.clone());
//         resolve(serverResponse);
//       }          
//     } catch (error) {
//       const staticCache = await caches.open(STATIC_CACHE);
//       resolve(staticCache.match('/offline.html'));
//     }      
//   })) 
// })

// cache then network
self.addEventListener('fetch', async function(event) {  
  const url = 'https://httpbin.org/get';  

  // only uses cache then network in this url
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(new Promise(async (resolve, reject)=> {        
        const dinamicCache = await caches.open(DYNAMIC_CACHE);
        const response = await fetch(event.request);
        dinamicCache.put(event.request.url, response.clone());
        resolve(response);      
    })) 
  } else if(new RegExp('\\b' + STATIC_FILES.join('\\b|\\b') + '\\b').test(event.request.url)) {
    // cache only strategy
    event.respondWith(caches.match(event.request))
  }
  else {
    // cache then network with offline fallback
      event.respondWith(new Promise(async (resolve, reject)=> {  
        try {
          const response = await caches.match(event.request);
          if (response) {
            console.log('tem');
            resolve(response);
          } else {
            console.log('não tem');
            const serverResponse = await fetch(event.request);
            const dynamicCache = await caches.open(DYNAMIC_CACHE);
            dynamicCache.put(event.request.url, serverResponse.clone());
            resolve(serverResponse);
          }          
        } catch (error) {
          // offline fallback
          const staticCache = await caches.open(STATIC_CACHE);
          if (event.request.url.indexOf('/help')) {
            resolve(staticCache.match('/offline.html'));
          }          
        }      
    })) 
  }
})


// cache only
//  problem - no dynamic caching
// even with internet our page will not work
// self.addEventListener('fetch', async function(event) {  
//   event.respondWith(new Promise(async (resolve, reject)=> {  
//     try {
//       const response = await caches.match(event.request);
//       resolve(response)
//     }
//     catch(error) {
//       console.log(error);
//     }      
//   })) 
// })



// network only
// not exatcly a caching strategy
// self.addEventListener('fetch', async function(event) {  
//   event.respondWith(new Promise(async (resolve, reject)=> {  
//     try {      
//       resolve(fetch(event.request))
//     }
//     catch(error) {
//       console.log(error);
//     }      
//   })) 
// })


// network first then cache
// with dynamic caching
// self.addEventListener('fetch', async function(event) {  
//   event.respondWith(new Promise(async (resolve, reject)=> {      
//       try {
//         const fetchRespose = await fetch(event.request); 
//         const dynamicCache = await caches.open(DYNAMIC_CACHE);
//         await dynamicCache.put(event.request.url, fetchRespose.clone());        
//         resolve(fetchRespose);
//       } catch (error) {
//         const response = await caches.match(event.request);        
//         resolve(response);                                         
//       }        
//   })) 
// })