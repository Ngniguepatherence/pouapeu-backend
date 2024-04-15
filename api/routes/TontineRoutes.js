const express = require('express');
const router = express.Router();
const TontineController = require('../controllers/TontineController');



router.get('/', TontineController.getAll);
router.post('/', TontineController.addTontine);



module.exports = router;