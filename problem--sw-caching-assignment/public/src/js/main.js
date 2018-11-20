
var box = document.querySelector('.box');
var button = document.querySelector('button');

button.addEventListener('click', function(event) {
  if (box.classList.contains('visible')) {
    box.classList.remove('visible');
  } else {
    box.classList.add('visible');
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw-max.js')
    .then(function() {
      console.log('Service worker foi instalado com sucesso.');
    })
    .catch(function(err) {
        console.log('Erro ao instalar service worker: ', err)
    }); 
}