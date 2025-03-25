const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require('dotenv').config();

const userController = require('./controllers/userControllers');
const vacanciesRouter = require('./routes/vacancies'); 
const usersRouter = require('./routes/users'); 

const app = express();
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.options("", cors(corsConfig));
app.use(cors(corsConfig));
app.use(express.json());

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "company-logos", // Your cloudinary folder
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp']
    },
});

const upload = multer({ storage });

// Update your route to use Cloudinary
app.put('/update-company', upload.single('_filename'), userController.UpdateCompany);

app.use('/vacancy', vacanciesRouter);
app.use('/auth', usersRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
