const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");
const { firebaseConfig } = require("firebase-functions");
const { firestore } = require("firebase-admin");

admin.initializeApp();

const auth = admin.auth();
const db = getFirestore();

exports.registerUser = functions.auth.user().onCreate((user) => {
  console.log("===USER CREATION===\n" + user.email + '\n')
  let docRef = db.collection("users").doc(user.uid);

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

  docRef = db.collection("groups").doc("groups");

  docRef.update({
    users: firestore.FieldValue.arrayUnion(user.email),
  }).catch((error) => {
    functions.logger.error(error, {structuredData: true});
    console.log(error);
  }).then(() => {
    console.log("groups collection updated !")
    res.send("groups collection updated !");
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

exports.genUserWithGroups = functions.firestore.document("/groups/groups").onCreate((change, ctx) => {
    for (const i of change.data().admin) {
      auth.createUser({
        email: i,
        password: "123456",
        disabled: false,
      })
      .then((userRecord) => {
        console.log('Successfully created new user:', userRecord.uid);
        let docRef = db.collection("users").doc(userRecord.uid);
        docRef.set({
          uid: userRecord.uid,
          email: i,
          group: "admin",
        }).catch((error) => {
          functions.logger.error(error, {structuredData: true});
          console.log(error);
        }).then(() => {
          console.log("Users collection updated !")
          res.send("Users collection updated !");
        });
      })
      .catch((error) => {
        console.log('Error creating new user:', error);
      });
    }

    for (const i of change.data().managers) {
      auth.createUser({
        email: i,
        password: "123456",
        disabled: false,
      })
      .then((userRecord) => {
        console.log('Successfully created new user:', userRecord.uid);
        let docRef = db.collection("users").doc(userRecord.uid);
        docRef.set({
          uid: userRecord.uid,
          email: i,
          group: "manager",
        }).catch((error) => {
          functions.logger.error(error, {structuredData: true});
          console.log(error);
        }).then(() => {
          console.log("Users collection updated !")
          res.send("Users collection updated !");
        });
      })
      .catch((error) => {
        console.log('Error creating new user:', error);
      });
    }
})