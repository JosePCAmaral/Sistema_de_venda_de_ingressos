const express = require('express');
const { createTicket, getTickets, buyTicket } = require('../controllers/ticketController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getTickets);
router.post('/buy', authMiddleware, buyTicket);
router.post('/create', authMiddleware, createTicket);

module.exports = router;