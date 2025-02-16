const express = require('express');
const authRoutes = require('./authRoutes');
const ticketRoutes = require('./ticketRoutes');

const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/tickets', ticketRoutes);

module.exports = router;