const express = require('express');
const chalk = require('chalk');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Connecting mongoose
const connectDBMongoose = require('./models/mongoose');
connectDBMongoose();

// Home route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Booting app
app.listen(port, () => {
    console.log(chalk.blueBright(`Example app listening at http://localhost:${port}`));
});
