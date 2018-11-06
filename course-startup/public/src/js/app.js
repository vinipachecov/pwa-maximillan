var deferredPromt;
// Check if page has a SW in it
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js' )
        .then(function() {
            console.log('Service worker is registered.');
        })        
}


// display right before the install banner
window.addEventListener('beforeinstallprompt', function(event) {
    
    console.log('beforeinstallprompt fired');
  
   event.preventDefault();
   deferredPromt = event
   return false;

  });