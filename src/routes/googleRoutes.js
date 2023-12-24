const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../models/passportConfig');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {session: false}),
    (req,res) => {
        res.redirect("/auth/profile/");
    }
);

router.get("/profile",(req,res)=> {
    console.log(req);
    res.send("Welcome");
});


module.exports = router;