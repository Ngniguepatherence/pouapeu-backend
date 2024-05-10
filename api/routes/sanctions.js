const express = require('express');
const router = express.Router();

const sanctionsController = require('../controllers/SanctionController');


router.post('/motifs_sanction', sanctionsController.addMotif);
router.put('/motifs_sanction/:id', sanctionsController.updateMotif);
router.get('/motifs_sanction', sanctionsController.getAllMotif);
// router.get('/motifs_sanction/:id', sanctionsController.getOne);

router.post('/', sanctionsController.addSanction);
router.put('/:id', sanctionsController.updateSanction);
router.get('/', sanctionsController.getAll);
router.get('/:id', sanctionsController.getOne);


module.exports = router;
