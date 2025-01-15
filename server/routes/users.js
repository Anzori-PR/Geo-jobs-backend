const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');

// Register a new user
router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.get('/all', userController.GetAllCompany);
router.get('/CompanyDetails/:id', userController.GetCompanyById);
router.put('/UpdateCompany', userController.UpdateCompany);
router.get('/search', userController.searchCompany);

module.exports = router;
