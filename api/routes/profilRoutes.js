const express = require('express');
const router = express.Router();
const profilController = require('../controllers/profilController');

router.get('/',profilController.getProfils);
router.get('/login',profilController.getProfil);
router.post('/',profilController.addProfil);

module.exports = router;