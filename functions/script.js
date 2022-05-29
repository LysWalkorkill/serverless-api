const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");

admin.initializeApp();

const auth = admin.auth();
const db = getFirestore();


const docRef = db.collection("users").doc();

