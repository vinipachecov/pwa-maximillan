var deferredPromt;

// Used to check if the browser
// doesn't have promise implemented
// and use the Promise polyfill 
if (!window.Promise) {
    window.Promise = Promise;
}
// Check if page has a SW in it
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js' )
        .then(function() {
            console.log('Service worker is registered.');
        })
        .catch(function(err) {
            console.log('Error registering service worker: ', err)
        });        
}


// display right before the install banner
window.addEventListener('beforeinstallprompt', function(event) {
    console.log('beforeinstallprompt fired');
   event.preventDefault();
   deferredPromt = event
   return false;
  });


  