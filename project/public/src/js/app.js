var defferedPrompt;

if(!window.Promise) {
  window.Promise = Promise;
}


async function initializeServiceWorker() { 
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js')    
      console.log('Service worker registered!');          
    } catch (error) {
      console.log('Error registering service worker, ', error);     
    }  
  }
  window.addEventListener('beforeinstallprompt', function(event) {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
  });
}


initializeServiceWorker();



