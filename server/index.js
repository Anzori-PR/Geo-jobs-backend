const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const multer = require("multer");
const path = require("path");

const userController = require('./controllers/userControllers');

const vacanciesRouter = require('./routes/vacancies'); 
const usersRouter = require('./routes/users'); 

const app = express()
app.use(cors());
app.use(express.json());

require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/vacancies');

const storage = multer.diskStorage({
    destination: './uploads/company-logos/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|webp|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});
// Add the upload middleware to your UpdateCompany route
app.put('/update-company', upload.single('companyLogo'), userController.UpdateCompany);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/vacancy', vacanciesRouter);
app.use('/auth', usersRouter);

app.listen(3001, "0.0.0.0", () => {
    console.log("Server is running")
})

module.exports = app;

