const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'company'] },
    companyInfo: {
        companyName: { type: String },
        companyCategory: { type: String },
        email: { type: String },
        phone: { type: String },
        description: { type: String },
        address: { type: String },
        website: { type: String },
        socialMedia: { type: String },
        _filename: { type: String }          
    }
});

module.exports = mongoose.model('User', userSchema);
