const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");

admin.initializeApp();

const auth = admin.auth();
const db = getFirestore();

exports.registerUser = functions.auth.user().onCreate((user) => {
  console.log("===USER CREATION===\n" + user.email + '\n')
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
  console.log("===USER DELETION===\n" + user.email + '\n')
  const docRef = db.collection("users").doc(user.uid).delete()
  .catch((error) => {
    functions.logger.error(error, {structuredData: true});
    console.log(error);
  }).then(() => {
    console.log("Users collection updated !")
    res.send("Users collection updated !");
  });
})

exports.deleteUser = functions.firestore.document("/users/{userID}").onDelete((change, ctx) => {
  auth.deleteUser(ctx.params.userID)
  .then(() => {
    console.log(`User ${ctx.params.userID} deleted from Authentication!`)
    res.send(`User ${ctx.params.userID} deleted from Authentication!`);
  })
})
