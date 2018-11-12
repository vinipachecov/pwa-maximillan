const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const configs = require('./config');


var serviceAccount = require('./pwagram-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: configs.databaseURL  
});

exports.storePostData = functions.https.onRequest((request, response) => {
  cors(request, response, function() {    
      admin.database().ref('posts').push({
        id: request.body.id,
        title:request.body.title,
        location:request.body.location,
        image: request.body.image
      })
      .then(() => {
        response.status(201).json({ messagE: 'Data store', id: request.body.id });
      })
      .catch(err => response.status(500).json({ error: err }));         
  })
});
