const express = require('express');
const chalk = require('chalk');
require('dotenv').config();
const app = express();
const path = require('path');

// Connecting mongoose
const connectDBMongoose = require('./controllers/mongoose');
connectDBMongoose();

// Load view engine | Path: Directory name + map name.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home route
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/ontdekken', (req, res) => {
    res.render('my_matches');
});

//// Need to change to books
// app.get('/ontdekken', (req, res) => {
//     User.find({}, (err, users) => {
//         if (err) {
//             res.status(404).render('404');
//         } else {
//             const filteredUsers = users.filter((user) => {
//                 if (
//                     !(
//                         loggedInUser.matched.includes(user._id.toString()) ||
//                         loggedInUser.ignored.includes(user._id.toString())
//                     )
//                 ) {
//                     return user;
//                 }
//             });
//             let matchedBoeken = [];
//             for (const user of filteredUsers) {
//                 let count = 0;
//                 for (const interest of user.codeInterests) {
//                     if (loggedInUser.codeInterests.includes(interest)) {
//                         count++;
//                     }
//                     if (count >= 2) {
//                         matchedBoeken.push(user);
//                         break;
//                     }
//                 }
//             }

//             if (matchedUsers.length === 0) {
//                 res.render('ontdekken_empty', {
//                     title: 'Boeken ontdekken',
//                     empty: 'Oeps! Het lijkt erop dat je niet gematched bent aan een boek.',
//                 });
//             } else {
//                 res.render('ontdekken', {
//                     title: 'Boeken ontdekken',
//                     boeken: matchedBoeken,
//                     aantalMatches: matchedUsers.length,
//                 });
//             }
//         }
//     });
// });

app.get('/mijn-matches', (req, res) => {
    res.render('my_matches');
});

//// Need to change to my book matches
// app.get('/mijn-matches', (req, res) => {
//     let matchedUsers = [];
//     loggedInUser.matched.forEach((user) => {
//         matchedUsers.push(user);
//     });
//     User.find(
//         {
//             _id: { $in: matchedUsers },
//         },
//         (err, users) => {
//             if (err) {
//                 console.log(err);
//                 res.redirect('/');
//             } else {
//                 if (matchedUsers.length === 0) {
//                     res.render('my_matches_empty', {
//                         title: 'Mijn Matches',
//                         empty: 'Oeps! Het lijkt erop dat je nog geen matches hebt geaccepteerd.',
//                     });
//                 } else {
//                     res.render('my_matches', {
//                         title: 'Mijn Matches',
//                         boeken: users,
//                     });
//                 }
//             }
//         },
//     );
// });

// Handling 404
// TODO: Even kijken of ik use moet gebruiken of iets anders.
app.use((req, res, next) => {
    res.status(404).render('404');
    next();
});

// Booting app
app.listen(process.env.PORT, () => {
    console.log(chalk.blueBright(`Example app listening at http://localhost:${process.env.PORT}`));
});
