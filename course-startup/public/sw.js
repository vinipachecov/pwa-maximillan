var CACHE_STATIC_NAME = 'static-v4'
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
self.addEventListener('install', function(event) {
    // this event gives us info about the instalattion
    console.log('[Service Worker] installing service worker ...', event);

    // access the cache api sending a name of the resource to be cached
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
        .then(function (cache) {
            // now we can add files to the cache
            console.log('[Service Worker] Precaching App Shell');
            // send the path to our files
            cache.addAll([
                '/',
                '/index.html',
                '/src/js/app.js',
                '/src/js/feed.js',
                // Don't need to them as older browsers don't support SW
                // the only reason is for performance as they are loaded from app.js
                '/src/js/promise.js',
                '/src/js/fetch.js',
                '/src/js/material.min.js',
                '/src/css/app.css',
                '/src/css/feed.css',
                '/src/images/main-image.jpg',                
                // loading from a cdn
                'https://fonts.googleapis.com/css?family=Roboto:400,700',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
            ])            
        })
    )   
})

// Fires when a new service worker is activated
self.addEventListener('activate', function(event) {
    // this event gives us info about the instalattion
    console.log('[Service Worker] activating service worker ...', event);

    //Doing some work in the caches
    event.waitUntil(
        caches.keys()
            .then(function(keyList) {
                return Promise.all(keyList.map(function(key) {
                    // check if the cache name is not the same of my 
                    // most updated cache
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



// // when fetch is used in our application
// // Load css
// // load images
self.addEventListener('fetch', function(event) {
    // console.log('[Service worker] fetching something ...', event);

    // overwrite data that is sent back
    // event.respondWith(fetch(event.request))        
    //Make sure we fetch the data from our cache 
    // when available
    event.respondWith(
        // check if is in the cache
        caches.match(event.request)
        .then(function (response) {
            console.log('response = ', response);
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
                        // put doesn't stores any request, but only the data you have
                        cache.put(event.request.url, res.clone())
                        return res;
                    })

                })
                .catch(function(err) {                    
                })
            }

        })
    )        
});

