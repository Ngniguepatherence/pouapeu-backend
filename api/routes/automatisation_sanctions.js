const express = require('express');
const automatisationSanctionController = require('../controllers/automatisations_sanction');
const router = express.Router();

router.get('/automatisations_possible',automatisationSanctionController.get_automatisations_possible)
router.post("/",)

module.exports = router;
