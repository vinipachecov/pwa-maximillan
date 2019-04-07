
var box = document.querySelector('.box');
var button = document.querySelector('button');

button.addEventListener('click', function(event) {
  if (box.classList.contains('visible')) {
    box.classList.remove('visible');
  } else {
    box.classList.add('visible');
  }
});

// Done 1) Register a Service Worker 
// Done 2) Identify the AppShell (i.e. core assets your app requires to provide its basic "frame") 
// Done 3) Precache the AppShell
// Done 4) Add Code to fetch the precached assets from cache when needed
// Done 5) Precache other assets required to make the root index.html file work
// Done 6) Change some styling in the main.css file and make sure that the new file gets loaded + cached (hint: versioning)
// Done 7) Make sure to clean up unused caches
// Done 8) Add dynamic caching (with versioning) to cache everything in your app when visited/ fetched by the user

// Important: Clear your Application Storage first to get rid of the old SW & Cache from the Main Course Project!