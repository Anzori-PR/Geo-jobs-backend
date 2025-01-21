const express = require('express');
const router = express.Router();

const vacancyController = require('../controllers/vacancyControllers');

router.post('/add', vacancyController.addVacancy);
router.get('/all', vacancyController.getAll);
router.get('/details/:id', vacancyController.getById);
router.get('/vacancies/:id', vacancyController.getAllVacancyByCompanyId);
router.get('/search', vacancyController.searchVacancy);
router.delete('/delete/:id', vacancyController.deleteVacancy);

module.exports = router;