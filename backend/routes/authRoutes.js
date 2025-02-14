const express = require('express');
const { register, registerAdm, login } = require('../controllers/authController');
const isAdmin = require("../middleware/isAdmMiddleware");
const router = express.Router();

router.post('/register', register);
router.post('/registerAdm', isAdmin, registerAdm);
router.post('/login', login);

module.exports = router;
