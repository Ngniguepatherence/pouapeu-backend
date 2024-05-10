const express = require('express');
const router = express.Router();

const SeanceController = require('../controllers/SeanceController');


router.post('/', SeanceController.addSeance);
router.get('/', SeanceController.getALL);
router.get('/:id', SeanceController.getOne);
router.put('/:id', SeanceController.updateSeance);
router.post('/:id/add_sanction', SeanceController.addSanction);
router.post('/:id/saveParticipations', SeanceController.saveParticipations);

module.exports = router;
