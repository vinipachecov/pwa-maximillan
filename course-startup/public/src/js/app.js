var deferredPromt;
var enableNotificationssButtons = document.querySelectorAll('.enable-notifications');

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

const displayConfirmNotification = () => {
    new Notification('Successfully subscribed! :)');
}

const askForNotificationPermission = () => { 
    console.log('asking for user permission...');
    Notification.requestPermission((result) => {
        console.log('User choice', result);
        if (result !== 'granted') {
            console.log('No notification permission granted!');
        } else {            
            //hide the button
        }
    });
}


if ('Notification' in window) {
    // check if there is support for notifications in the browser    
    for (const iterator of enableNotificationssButtons) {        
        iterator.style.display ='inline-block';
        iterator.addEventListener('click', askForNotificationPermission); 
    }
        
}