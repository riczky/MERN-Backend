const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

// Register -> POST
// localhost:4000/v1/auth/register
router.post('/register', authController.register);

module.exports = router;
