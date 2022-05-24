const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

const auth = admin.auth();
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.getAllUsers = functions.https.onRequest((req, res) => {
    let tmp = [];
  
    auth.listUsers().then((userRecords) => {
      userRecords.users.forEach((user) => {
          tmp.push({id: user.uid, email: user.email})
        //   console.log(tmp)
        });
    }).catch((error) => console.log(error))
    .then(() => {
        res.send(JSON.stringify(tmp))
    })
  });