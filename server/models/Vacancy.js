const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
    companyId: { type: String, required: true },
    category: { type: String, required: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    company: { type: String, required: true },
    postedDate: { type: Date, default: Date.now },
    closingDate: { type: Date, required: true },
    employmentType: { type: String, required: true },
    status: { type: String, default: "pending" } // 'pending' | 'approved' | 'rejected'
}, { versionKey: false });

const Model = mongoose.model('vacancy', vacancySchema, "vacancy");
module.exports = Model;