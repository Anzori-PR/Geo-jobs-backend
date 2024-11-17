const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');

// Register a new user
router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.put('/UpdateCompany', userController.UpdateCompany);

module.exports = router;
