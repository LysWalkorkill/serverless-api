var admin = require("firebase-admin");
var serviceAccount = require("./scriptSA.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serverless-architecture-351112-default-rtdb.europe-west1.firebasedatabase.app"
});

const auth = admin.auth()

auth.listUsers()
.then((user) => {
    console.log(JSON.stringify(user) + '\n')
})