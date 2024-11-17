const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
    category: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
}, { versionKey: false });

const Model = mongoose.model('vacancy', vacancySchema, "vacancy");
module.exports = Model;