const VacancyModel = require('../models/Vacancy');

module.exports = {
    getAll: (req, res) => {
        VacancyModel.find()
            .then(function (data) {
                res.json(data);
            }).catch(function (err) {
                res.status(500).json({ error: 'Failed to retrieve vacancies' });
            });
    },
    getById: (req, res) => {
        const vacancyId = req.params.id;

        VacancyModel.findById(vacancyId)
            .then(function (data) {
                if (!data) {
                    return res.status(404).json({ error: 'Vacancy not found' });
                }
                res.json(data);
            })
            .catch(function (err) {
                res.status(500).json({ error: 'Failed to retrieve the vacancy' });
            });
    },
}
