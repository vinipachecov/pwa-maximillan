
var button = document.querySelector('#start-button');
var output = document.querySelector('#output');

button.addEventListener('click', async function() {
  // Create a new Promise here and use setTimeout inside the function you pass to the constructor
  // try {    
  //   const response = await new Promise((resolve, reject) => {
  //     setTimeout(function() { // <- Store this INSIDE the Promise you created!        
  //       resolve('https://swapi.co/api/people/1')
  //     }, 3000);
  //   });  
  //   console.log(response);
  //   const fetchRespose = await fetch(response);    
  //   const data = await fetchRespose.json();         
  //   output.textContent = data.name;   
  // } catch (error) {
  //   console.log(error);
  // }    

  try {
    const response2 = await new Promise((resolve, reject) => {
      setTimeout(function() { // <- Store this INSIDE the Promise you created!        
        resolve('https://httpbin.org/put')
      }, 3000);
    });     
    const fetchResponse2 = await fetch(response2, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({person: {name: 'Max', age: 28}})
    })     
    const data2 = await fetchResponse2.json();   
    console.log('data2 = ', data2.json); 
    output.textContent = data2.json.person.name;

  } catch (error) {
    console.log(error)    
  }  
  // Repeat the exercise with a PUT request you send to https://httpbin.org/put
  // Make sure to set the appropriate headers (as shown in the lecture)
  // Send any data of your choice, make sure to access it correctly when outputting it
  // Example: If you send {person: {name: 'Max', age: 28}}, you access data.json.person.name
  // to output the name (assuming your parsed JSON is stored in "data")

  // To finish the assignment, add an error to URL and add handle the error both as
  // a second argument to then() as well as via the alternative taught in the module
});