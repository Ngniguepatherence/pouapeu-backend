const express = require('express');
const router = express.Router();

const saisonController = require('../controllers/saisonController');


router.post('/', saisonController.addSaison);
router.put('/:id', saisonController.updateSaison);
router.get('/', saisonController.getAll);
router.get('/:id', saisonController.getOne);
router.get('/:id/transactions', saisonController.getTransactions);
router.post('/:id/inscriptions',saisonController.addInscription);

module.exports = router;
