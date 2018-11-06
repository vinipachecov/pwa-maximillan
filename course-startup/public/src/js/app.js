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


fetch('https://httpbin.org/ip')
  .then(function(response) {
      console.log('respose', response);
      return response.json();
  })
  .then(function (data) {
      console.log(data)
  })
  .catch( function(err) {
      console.log(err);
  })


// old request way
// not asynchronous
// var xhr = XMLHttpRequest();
// xhr.open('GET', 'https://httpbin.org/ip');
// xhr.responseType = 'json;

// xhr.onload = function() {
//     console.log(xhr.response)
// };

// xhr.onerror = function() {
//     console.log('Error');
// }

// asynchronous
//fetch way
fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify({
        message: 'Does this work?'
    })
})
.then(function(response) {
    console.log('respose', response);
    return response.json();
})
.then(function (data) {
    console.log(JSON.parse(data.data))
})
.catch( function(err) {
    console.log(err);
})