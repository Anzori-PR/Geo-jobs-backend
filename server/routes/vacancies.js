const express = require('express');
const router = express.Router();

const vacancyController = require('../controllers/vacancyControllers');

router.get('/all', vacancyController.getAll);
router.get('/details/:id', vacancyController.getById);

module.exports = router;