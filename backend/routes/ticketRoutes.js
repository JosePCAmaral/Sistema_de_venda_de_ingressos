const express = require('express');
const { createTicket, getTickets, buyTicket, getHomeData, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { authMiddleware } = require('../middleware/authMiddleware');
const  isAdmin  = require('../middleware/isAdmMiddleware');
const router = express.Router();

router.get("/home-data", getHomeData);
router.get('/getTickets', getTickets);
router.post("/buy", authMiddleware, buyTicket);
router.post('/create', isAdmin, createTicket);
router.put("/update/:id", isAdmin, updateTicket);
router.delete("/delete/:id", isAdmin, deleteTicket);

module.exports = router;