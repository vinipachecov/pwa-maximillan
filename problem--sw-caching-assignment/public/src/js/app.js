async function initializeServiceWorker() {
  if ('serviceWorker' in navigator) {    
    try {      
      await navigator.serviceWorker.register('/sw.js');  
      console.log('[Service Worker] registered!');    
    } catch (error) {
      console.log(error);      
    }    
  }
}

initializeServiceWorker()