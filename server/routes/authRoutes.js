// /server/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// http://localhost:3001/api/auth/register
router.post('/register', register);

// http://localhost:3001/api/auth/login
router.post('/login', login);

module.exports = router;