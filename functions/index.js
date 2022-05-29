const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");

admin.initializeApp();

const auth = admin.auth();
const db = getFirestore();

exports.registerUser = functions.auth.user().onCreate((user) => {
  console.log("===USER CREATED===\n" + user.email + '\n')
  const docRef = db.collection("users").doc(user.uid);

  docRef.set({
    uid: user.uid,
    email: user.email,
    group: "user",
  }).catch((error) => {
    functions.logger.error(error, {structuredData: true});
    console.log(error);
  }).then(() => {
    console.log("Users collection updated !")
    res.send("Users collection updated !");
  });
})

exports.unRegisterUser = functions.auth.user().onDelete((user) => {
  console.log("===USER DELETED===\n" + user.email + '\n')
  const docRef = db.collection("users").doc();

  docRef.delete({
    uid: user.uid,
  }).catch((error) => {
    functions.logger.error(error, {structuredData: true});
    console.log(error);
  }).then(() => {
    console.log("Users collection updated !")
    res.send("Users collection updated !");
  });
})