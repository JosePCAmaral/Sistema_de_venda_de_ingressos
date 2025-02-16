const express = require('express');
const { register, registerAdm, login, updateUser, deleteUser } = require('../controllers/authController');
const isAdmin = require("../middleware/isAdmMiddleware");
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/registerAdm', isAdmin, registerAdm);
router.post('/login', login);
router.put("/update/:id", authMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, deleteUser);

module.exports = router;
