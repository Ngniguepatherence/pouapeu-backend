const express = require('express');
const transactionController = require('../controllers/transaction');
const router = express.Router();



router.get('/', transactionController.getAll);
router.get('/:id', transactionController.get);



module.exports = router;