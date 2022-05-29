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

const users = ["hleonardddd@mail.com", "adrienddd@mail.com", "romainddd@mail.com", "laytodddn@mail.com"]

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
