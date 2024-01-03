const express = require('express');
const router = express.Router();

const EventController = require('../controllers/EventController');


router.get('/',EventController.getEvent);
router.post('/',EventController.AddEvent);
// router.get('/:user', EventController.getEventUserId);
router.get('/:id', EventController.getEventId);

module.exports =  router;