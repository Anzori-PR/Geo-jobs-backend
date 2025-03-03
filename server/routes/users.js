const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');

// Register a new user
router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.get('/users', userController.GetAllUser);
router.get('/all', userController.GetAllCompany);
router.get('/CompanyDetails/:id', userController.GetCompanyById);
router.get('/search', userController.searchCompany);
router.get('/searchUser', userController.searchUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;
