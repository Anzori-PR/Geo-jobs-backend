const VacancyModel = require('../models/Vacancy');

module.exports = {
    addVacancy: (req, res) => {
        const { companyId, category, name, logo, description, location, salary, company, closingDate, employmentType } = req.body;

        const newVacancy = new VacancyModel({
            companyId,
            category,
            name,
            logo,
            description,
            location,
            salary,
            company,
            closingDate,
            employmentType
        });

        newVacancy.save()
            .then(function (data) {
                res.json(data);
            })
            .catch(function (err) {
                res.status(500).json({ error: 'Failed to add vacancy' });
            });
    },
    getAll: (req, res) => {
        VacancyModel.find()
            .then(function (data) {
                res.json(data);
            }).catch(function (err) {
                res.status(500).json({ error: 'Failed to retrieve vacancies' });
            });
    },
    searchVacancy: (req, res) => {
        const { name, category, location, status } = req.query;

        const filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }
        if (location) {
            filter.location = location;
        }
        if (status) {
            filter.status = status;
        }

        VacancyModel.find(filter)
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json({ error: 'Failed to search vacancies' });
            });
    },
    getAllVacancyByCompanyId: (req, res) => {
        const companyId = req.params.id;

        VacancyModel.find({ companyId })
            .then(function (data) {
                res.json(data);
            })
            .catch(function (err) {
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
    deleteVacancy: (req, res) => {
        const vacancyId = req.params.id;

        VacancyModel.findByIdAndDelete(vacancyId)
            .then(function (data) {
                if (!data) {
                    return res.status(404).json({ error: 'Vacancy not found' });
                }
                res.json(data);
            })
            .catch(function (err) {
                res.status(500).json({ error: 'Failed to delete the vacancy' });
            });
    },
    approveVacancy: async (req, res) => {
        const { id } = req.params;
        try {
            const vacancy = await VacancyModel.findByIdAndUpdate(id, { status: "approved" }, { new: true });
            res.json({ message: "Vacancy approved successfully", vacancy });
        } catch (error) {
            res.status(500).json({ error: "Failed to approve vacancy" });
        }
    },
    RejectVacancy: async (req, res) => {
        const { id } = req.params;
        try {
            const vacancy = await VacancyModel.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
            res.json({ message: "Vacancy Rejected", vacancy });
        } catch (error) {
            res.status(500).json({ error: "Failed to Reject vacancy" });
        }
    }
    
    
}
