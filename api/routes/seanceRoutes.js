const express = require('express');
const router = express.Router();

const SeanceController = require('../controllers/SeanceController');


router.post('/', SeanceController.addSeance);
router.get('/', SeanceController.getALL);


module.exports = router;
