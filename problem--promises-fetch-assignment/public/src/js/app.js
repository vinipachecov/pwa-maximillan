
var button = document.querySelector('#start-button');
var output = document.querySelector('#output');

button.addEventListener('click', function() {
  // Create a new Promise here and use setTimeout inside the function you pass to the constructor

  new Promise((resolve,reject) => {
    setTimeout(function() { 
      resolve('https://swapi.co/api/people/1');      
    }, 3000);
  })
  .then(function (url) {    
    return fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      output.textContent = data.name;      
    })    
  })  
  // Handle the Promise "response" (=> the value you resolved) and return a fetch()
  // call to the value (= URL) you resolved (use a GET request)

  // Handle the response of the fetch() call and extract the JSON data, return that
  // and handle it in yet another then() block

  // Finally, output the "name" property of the data you got back (e.g. data.name) inside
  // the "output" element (see variables at top of the file)

  new Promise((resolve,reject) => {
    setTimeout(function() { // <- Store this INSIDE the Promise you created!
      resolve('https://httpbin.org/put');      
    }, 3000);
  })
  .then(function (url) {
    fetch(url, {
      method: 'PUT',      
      body: JSON.stringify({ name: 'Vinicius', age: '27' })      
    })
    .then(function(response) {
      return response.json();            
    })
    .then(result => {      
      console.log('Name attribute = ', JSON.parse(result.data).name);
    })
  })  


  // Repeat the exercise with a PUT request you send to https://httpbin.org/put
  // Make sure to set the appropriate headers (as shown in the lecture)
  // Send any data of your choice, make sure to access it correctly when outputting it
  // Example: If you send {person: {name: 'Max', age: 28}}, you access data.json.person.name
  // to output the name (assuming your parsed JSON is stored in "data")

  new Promise((resolve,reject) => {
    setTimeout(function() { // <- Store this INSIDE the Promise you created!
      resolve('https://httpbin.org/put123');
      // Resolve the following URL: https://swapi.co/api/people/1
    }, 3000);
  })  
  .then(url => {
    fetch(url, {
      method: 'PUT',
      headers: 'cors',
      body: JSON.stringify({ name: 'Vinicius', age: '27' })      
    })
    .then(data => {
      const values = data.json();      
      console.log('Name attribute = ', JSON.parse(values.data).name);
    })
    .catch(function (err)  {
      console.log({ message: 'something wrong'});
    })
   
  }).catch(err => console.log({ message: 'something wrong'}));  

  // To finish the assignment, add an error to URL and add handle the error both as
  // a second argument to then() as well as via the alternative taught in the module
});