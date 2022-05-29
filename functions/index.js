const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");

admin.initializeApp();

const auth = admin.auth();
const db = getFirestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((req, res) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  res.send("Hello from Firebase!");
});

exports.registerUser = functions.auth.user().onCreate((user) => {
  console.log("===USER CREATED===\n" + user.email + '\n')
  const docRef = db.collection("users").doc();

  docRef.set({
    uid: user.uid,
    email: user.email,
  }).catch((error) => {
    functions.logger.error(error, {structuredData: true});
    console.log(error);
  }).then(() => {
    console.log("Users collection updated !")
    res.send("Users collection updated !");
  });
})

exports.getAllUsers = functions.https.onRequest((req, res) => {
  const tmp = [];

  auth.listUsers().then(async (userRecords) => {
    const user = await auth.verifyIdToken(req.headers.idtoken)
    console.log("role Signed-in => " + user.role)
    userRecords.users.forEach((user) => {
      tmp.push({id: user.uid, email: user.email});
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
