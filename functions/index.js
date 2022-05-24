const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");
admin.initializeApp();

const auth = admin.auth();
const db = getFirestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.getAllUsers = functions.https.onRequest((req, res) => {
  const tmp = [];

  auth.listUsers().then((userRecords) => {
    userRecords.users.forEach((user) => {
      tmp.push({id: user.uid, email: user.email});
      //   console.log(tmp)
    });
  }).catch((error) => {
    functions.logger.error(error, {structuredData: true});
    console.log(error);
  }).then(() => {
    res.send(JSON.stringify(tmp));
  });
});

exports.writeMessage = functions.https.onRequest((req, res) => {
  const docRef = db.collection("messages").doc();

  docRef.set({
    message: req.body.message,
    from: req.body.ownerID,
    to: req.body.receiverID,
    timestamp: Date.now(),
  }).catch((error) => {
    functions.logger.error(error, {structuredData: true});
    console.log(error);
  }).then(() => {
    res.send("Message collection updated !");
  });
});
