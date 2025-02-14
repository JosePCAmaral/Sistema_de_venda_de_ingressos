const express = require('express');
const { createTicket, getTickets, buyTicket } = require('../controllers/ticketController');
const { authMiddleware } = require('../middleware/authMiddleware');
const  isAdmin  = require('../middleware/isAdmMiddleware');
const router = express.Router();

router.get('/', getTickets);
router.post('/buy', authMiddleware, buyTicket);
router.post('/create/:id', isAdmin, createTicket);

module.exports = router;