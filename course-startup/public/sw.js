self.addEventListener('install', function(event) {
    // this event gives us info about the instalattion
    console.log('[Service Worker] installing service worker ...', event);
})

// Fires when a new service worker is activated
self.addEventListener('activate', function(event) {
    // this event gives us info about the instalattion
    console.log('[Service Worker] activating service worker ...', event);
    // ensure the service workers have activated
    return self.clients.claim();
})

// when fetch is used in our application
// Load css
// load images
self.addEventListener('fetch', function(event) {
    console.log('[Service worker] fetching something ...', event);

    // overwrite data that is sent back
    event.respondWith(fetch(event.request))        
});

