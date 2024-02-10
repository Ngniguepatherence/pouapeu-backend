const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../models/passportConfig');
// const admin  = require('firebase-admin');

// const firebaseConfig = {
//     apiKey: "AIzaSyCC2zLzqlq3lBNDMY3n0IreVlsEMuc3NY8",
//     authDomain: "pouapou-e5356.firebaseapp.com",
//     projectId: "pouapou-e5356",
//     storageBucket: "pouapou-e5356.appspot.com",
//     messagingSenderId: "1052773990485",
//     appId: "1:1052773990485:web:63ebce0c909bc1631594dc",
//     measurementId: "G-9D4DLR6SHB"
//   };
  
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault()
//     // databaseURL: 'gs://pouapou-e5356.appspot.com',
//   });


// router.get('/firebase', (req,res) => {
//     const provider = new admin.auth.GoogleAuthProvider();

//     provider.addScope('https://www.googleapis.com/auth/userinfo.email');

//     admin
//     .auth()
//     .getRedirectResult()
//     .then((result) => {
//       const { user } = result;
//       // Handle user authentication result
//       res.send({ user });
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).send({ error: 'Internal Server Error' });
//     });
// })
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', passport.authenticate('google', {session: false}),
//     (req,res) => {
//         res.redirect("http://localhost:3000/dashboard");
//     }
// );

// router.get('/logout', (req, res) => {
//     req.logout();
//     res.redirect('/');
// });

// router.get("/profile",(req,res)=> {
//     console.log(req);
//     res.json(req.user);
// });

// get user information from google connect and verify if it's exist on database
// router.get(req,res)


module.exports = router;