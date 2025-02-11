const express = require("express");
const { getTickets, createTicket } = require("../controllers/ticketController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getTickets);
router.post("/", authMiddleware, createTicket);

module.exports = router;
