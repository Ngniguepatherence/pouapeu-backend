const firebase = require('firebase-admin');
const credentials = require('./credentials.json');

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC2zLzqlq3lBNDMY3n0IreVlsEMuc3NY8",
  authDomain: "pouapou-e5356.firebaseapp.com",
  projectId: "pouapou-e5356",
  storageBucket: "pouapou-e5356.appspot.com",
  messagingSenderId: "1052773990485",
  appId: "1:1052773990485:web:63ebce0c909bc1631594dc",
  measurementId: "G-9D4DLR6SHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

initializeApp(firebaseConfig);
  
  module.exports = firebase;


