const express = require('express');
const chalk = require('chalk');
require('dotenv').config();
const path = require('path');


// Initializing app
const app = express();
const port = process.env.PORT;

// Connecting mongoose
const connectDBMongoose = require('./models/mongoose');

connectDBMongoose();

// Load view engine | Path: Directory name + map name.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.locals.basedir = app.get('views');

// Bodyparser from Express
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

// Serving static files (CSS, IMG, JS, etc.)
app.use('/assets', express.static(path.join(__dirname, 'public')));

// Route to mainController
const mainController = require('./controllers/mainController');
app.use('/', mainController);


// Do we still need this?
// // Update user
// app.post('/updateUser', (req, res) => {
//     User.findOneAndUpdate({ email: req.body.email }, { email: req.body.newEmail }, { new: true }, (error, data) => {
//         if (error) {
//             console.log(error);
//         } else {
//             res.redirect('/home');
//         }
//     });
// });

// // Delete user
// app.post('/deleteUser', async (req, res) => {
//     User.findOneAndDelete({ email: req.body.email }, (error, data) => {
//         if (error) {
//             console.log(error);
//         } else {
//             res.redirect('/register');
//         }
//     });
// });

// Booting app
app.listen(port, () => {
    console.log(chalk.blueBright(`Example app listening at http://localhost:${port}`));
});
