
var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

async function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();
    try {
      const choiceResult = await deferredPrompt.userChoice
      console.log(choiceResult.outcome);
      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }         
    } catch (error) {
      console.log('[Error sending userPrompt]',error)      
    }   

    deferredPrompt = null;
  }

  // if ('serviceWorker' in navigator) {
  //   const sws = await navigator.serviceWorker.getRegistrations();
  //   for (const sw of sws) {
  //     console.log('test');
  //     await sw.unregister();      
  //   }
  // }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// async function onSaveButtonClicked(event) {
//   console.log('test')
//   if ('caches' in window) {
//     const cache = await caches.open('user-requested');
//     cache.add('https://httpbin.org/get')
//     cache.add('/src/images/sf-boat.jpg');
//   }  
// }

function clearCard() {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }  
}

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = `url("${data.image}")`;
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = 'center';
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'save';

  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton)
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data) {
  console.log('updating data', data);
  for (const imageData  of data) {
    createCard(imageData)    
  }
}

const url = 'https://pwagram-68ff9.firebaseio.com/posts.json';
let networkDataReceived = false;

async function initPosts() {
  try {
    const response = await fetch(url);
    networkDataReceived = true;
    const data = await response.json();
    console.log('from the web', data);
    const dataArray = [];
    for (const key in data) {    
      dataArray.push(data[key]);    
    }
    clearCard();
    updateUI(dataArray);    
  } catch (error) {
    console.log(error);    
  }  
}
initPosts();

const createSecondCard = async () => {  
  if ('indexedDB' in window) {
    const data = await readAllData('posts');    
    // array of all values
    if(!networkDataReceived) {
      console.log('data = ', data);
      updateUI(data);
    }    
  }    
}
createSecondCard();
