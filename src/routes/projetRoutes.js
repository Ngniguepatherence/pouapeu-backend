const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');

router.get('/',projetController.getProjet);
router.get('/:id',projetController.getProjetId);
router.post('/',projetController.addProjet);

module.exports = router;