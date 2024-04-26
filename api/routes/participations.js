const express = require('express');
const ParticipationsController = require('../controllers/participationsController');
const router = express.Router();

router.get('/tontines',ParticipationsController.getTontines)

module.exports = router;
