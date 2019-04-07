# Progressive Web Apps - Complete Guide
This source code is part of Maximilian Schwarzmüller's "Progressive Web Apps - Complete Guide" course on udemy.com.

# How to Use
You need [Node.js](https://nodejs.org) installed on your machine. Simply download the installer from [nodejs.org](https://nodejs.org) and go through the installation steps.

Once Node.js is installed, open your command prompt or terminal and **navigate into this project folder**. There, run `npm install` to install all required dependencies.

Finally, run `npm start` to start the development server and visit [localhost:8080](http://localhost:8080) to see the running application.

## Service worker registration

To register a service worker we need to check if the 'serviceWoker' key is in the navigator object of the browser DOM.
To do this we can use a function like this:

```
async function initializeServiceWorker() { 
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js')    
      console.log('Service worker registered!');          
    } catch (error) {
      console.log(error);     
    }  
  }
}
```

If we have a service worker we will call the function register()
which receives an argument of a file where our service worker code is.

## sw.js File or ServiceWorker file
On service worker file we don't access to the dom directly as
in a normal js file. Here we have access to the addEventListener function but we don't have access to the dom events like 'click' for example.
The events that can be accessed are:

* fetch - which can intercept all fetch requests
* push Notifications - been able to send notifications to the user after he has left the app (because Sws live beyond the screen)
* Notification Interaction - differently than with normal javascript, we can be sure if the element has been rendered or not, so with this we can evaluate user interactions and so something.
* Background Sync - cache content of the app and sync if connection is restored
* Service Worker Lifecycle - check the phase changes


## Service Worker Lifecycle

We can interact and check the different phases of the lifecycle of a service worker by listening to some events. We will start with:

* install
* activate

Install is very straing forward but activate only runs if we do it manually and "update" it.

## Event 'fetch'

Adding a listener to fetch to intercept requests from our application. We can use the function respondWith
after intercept the requests. It should look like this:

```
self.addEventListener('fetch', function(event) {
  console.log('[Service Worker] service worker fetching...', event);
  event.respondWith(null)
})
```

The null param in respondWith will crash the app, and we can replace it 'fetch(event.request)' for an actual response.

## Caching

Remember that we need to cache static content and dynamic content(generated in runtime for example).
The cache api in javascript has an URL as a key and a response object as the corresponding value. This means we can cache api requests and not only resources in our folders. 

## Openning the cache

First we will need to open the cache. To do this we use caches.open() method. 
Still we need it to run before the service worker start intercepting request, otherwise we will not be able to check it if it is not already in the cache.
To do this we use the event object from the installation of the service worker and invoke the method waitUntil() which will wait until the cache is opened.
The code would be like this:

```
const STATIC_CACHE = 'static'
self.addEventListener('install', function(event) {
  <!-- so the SW wait until cache is opened -->
  event.waitUntil(
    caches.open(STATIC_CACHE)
    .then(function(cache) {
      console.log('Open the cache of the service worker');
      console.log(cache);
      <!-- Add our static resources -->
      cache.add('./src/js/app.js')
    })
    )
})
```

in the fetch listener we need to try finding the match of the request been intercepted. This would look like these:

```

self.addEventListener('fetch', async function(event) {  
  // What will be returned
  event.respondWith(new Promise(async (resolve, reject)=> {  
    try {
      // try to find match in cache
      const response = await caches.match(event.request);
      if (response) {
        //has match, return it
        console.log('tem');
        resolve(response);
      } else {
        // don't have match, make the request
        console.log('não tem');
        resolve(fetch(event.request));    
      }          
    } catch (error) {
      console.log(error);      
      reject(error);
    }      
  })) 
})
```

## Dynamic Caching

Usually we don't require only static resources for our web apps to work properly. We also rely on dynamic resource provided by API's and other services.
Caching this type of content is named Dynamic Caching, which is to cache resources provided in run-time. This is achieved by first caching the request - remember that our cache api only stores requests and their corresponding responses - so in a next fetch attempt we will get it from our cache instead of getting from a network request.
To do this we will use another method from the cache api called put() which will save the request and the response.
This leads us to the intercepting listener fetch in our code, which will look something like this:

```
self.addEventListener('fetch', async function(event) {  
  event.respondWith(new Promise(async (resolve, reject)=> {  
    try {
      const response = await caches.match(event.request);
      if (response) {        
        resolve(response);
      } else {        
        // get the response from the request
        const serverResponse = await fetch(event.request);
        // open the dynamic cache to store it
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        // store the request and the cloned response
        // as the response can only be used once
        dynamicCache.put(event.request.url, serverResponse.clone());
        // return the response
        resolve(serverResponse);
      }          
    } catch (error) {
      console.log(error);      
      reject(error);
    }      
  })) 
})

```

still we need some cleaning of older cache otherwise we might endup serving the same cache files. To do this we usually think to do clean up right from the start, but remember that our app might still be in use by other users. This could probably crash the application leading to a terrible user experience.
To avoid this we need to clean up after activating, then all requets normally done will get from the previous cache and as soon the user refreshes it will get the newer cache.
Not to the code:

```

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
```

## Caching strategies

In the course we see some strategies for caching: 

* cache only
* network only
* network with cache fallback
* cache then network

### cache only
Cache only has problem because it doesn't let our page work properly as it intercept requests and only serves things from the cache.
Another problem is that dynamic caching is not stored, so it might not be a good use for most cases.

example:
```
// cache only
//  problem - no dynamic caching
// even with internet our page will not work
self.addEventListener('fetch', async function(event) {  
  event.respondWith(new Promise(async (resolve, reject)=> {  
    try {
      const response = await caches.match(event.request);
      resolve(response)
    }
    catch(error) {
      console.log(error);
    }      
  })) 
})
```

### network only 
Network only is a non caching strategy as it doesn't cache anything and only resolves the normal request as it was intercepted. Check it out:

```
self.addEventListener('fetch', async function(event) {  
  event.respondWith(new Promise(async (resolve, reject)=> {  
    try {      
      resolve(fetch(event.request))
    }
    catch(error) {
      console.log(error);
    }      
  })) 
})
```

### network first than cache
Network first than cache has the same problem as the cache only with dynamic content. It is only useful for precached assets.
The bigger problem here is that in poor connections we will have
to wait the request to fail, which can take a considerable ammount of time and only then attempt to find the resource on our cache (which can already be in it).

```
self.addEventListener('fetch', async function(event) {  
  event.respondWith(new Promise(async (resolve, reject)=> {      
      try {
        const fetchRespose = await fetch(event.request);        
        resolve(fetchRespose);
      } catch (error) {
        const response = await caches.match(event.request);        
        resolve(response);                                         
      }        
  })) 
})
```

### cache then network
Cache then network is a great strategy when considering poor connections because it can avoid the time required for a request to fail and also provides the resource FAST.
 
