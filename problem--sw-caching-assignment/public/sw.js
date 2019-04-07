const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

self.addEventListener('install', (event) => {
  const preCache = async () => {
    const staticCache = await caches.open(STATIC_CACHE);
    staticCache.addAll([
      '/',
      '/index.html',
      'https://fonts.googleapis.com/css?family=Roboto:400,700',
      'https://fonts.googleapis.com/icon?family=Material+Icons',
      'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
      '/src/css/app.css',
      '/src/css/main.css',
      '/src/js/app.js',
      '/src/js/main.js',
      '/src/js/material.min.js'
    ])    
  };
  event.waitUntil(preCache());
  console.log('[Service Worker] installing...');
})

self.addEventListener('activate', async event => {
  console.log('[Service Worker] activating...');
  const cleanUp = async () => {
    const keylist = await caches.keys();
    await Promise.all(
      keylist.map(async key => {
        if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE){
          return caches.delete(key);
        }        
      })
    )    
  };
  event.waitUntil(cleanUp());
  return self.clients.claim()
});

self.addEventListener('fetch', event => {
  event.respondWith(new Promise(async (resolve, reject) => {
    try {
      const response = await caches.match(event.request);
      if (response) {
        resolve(response);
      } else {                
        const serverRespose = await fetch(event.request);
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        await dynamicCache.put(event.request.url, serverRespose.clone());
        resolve(serverRespose);
      }      
    } catch (error) {
      reject(error)
    }
  }))
});