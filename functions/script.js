var admin = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");
var serviceAccount = require("./scriptSA.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serverless-architecture-351112-default-rtdb.europe-west1.firebasedatabase.app"
});

const auth = admin.auth()
const db = getFirestore();

auth.listUsers()
.then((user) => {
    console.log(JSON.stringify(user) + '\n')
})

const users = ["hadrien@mail.com", "adrien@mail.com", "romain@mail.com", "layton@mail.com"]

for (const user of users) {
  auth.createUser({
    email: user,
    password: "123456",
    disabled: false,
  })
  .then((userRecord) => {
    console.log('Successfully created new user:', userRecord.uid);
  })
  .catch((error) => {
    console.log('Error creating new user:', error);
  });
}

const docRef = db.collection("groups").doc("groups");

  docRef.set({
    admins: ["hadrien@gmail.com", "adrien@gmail.com"],
    managers: ["romain@gmail.com", "layton@gmail.com"],
    users: [],
  }).catch((error) => {
    functions.logger.error(error, {structuredData: true});
    console.log(error);
  }).then(() => {
    console.log("groups collection updated !")
  });