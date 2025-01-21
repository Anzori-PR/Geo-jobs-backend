const express = require('express')
const mongoose = require('mongoose')

const vacanciesRouter = require('./routes/vacancies'); 
const usersRouter = require('./routes/users'); 


const app = express()
app.use(express.json());

require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/vacancies');

app.use('/vacancy', vacanciesRouter);
app.use('/auth', usersRouter);

app.listen(3001, () => {
    console.log("Server is running")
})

module.exports = app;