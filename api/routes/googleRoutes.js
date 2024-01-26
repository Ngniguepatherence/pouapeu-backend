const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../models/passportConfig');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();});
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {session: false}),
    (req,res) => {
        res.redirect("http:localhost:3000/");
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth/login');
});

router.get("/profile",(req,res)=> {
    console.log(req);
    res.json(req.user);
});


module.exports = router;