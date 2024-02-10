const express = require('express');
const router = express.Router();
const authController  = require('../controllers/AuthController');

router.post('/google',authController.Login);
router.post('/login',authController.Auth);
router.post('/logout',authController.Logout);


module.exports = router;