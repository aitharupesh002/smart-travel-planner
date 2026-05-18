const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');

router.post('/calculate', travelController.calculateRoutes);
router.post('/book', travelController.bookTicket); // New endpoint for booking flow

module.exports = router;
