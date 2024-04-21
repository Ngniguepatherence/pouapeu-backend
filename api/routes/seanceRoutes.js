const express = require('express');
const router = express.Router();

const SeanceController = require('../controllers/SeanceController');


router.post('/', SeanceController.addSeance);
router.get('/', SeanceController.getALL);
router.get('/:id', SeanceController.getOne);

module.exports = router;
