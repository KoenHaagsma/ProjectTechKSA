const express = require('express');
const chalk = require('chalk');
require('dotenv').config();
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flasher = require('express-flash');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');

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

// cookie-parser for flash messages
app.use(cookieParser(process.env.SESSION_SECRET));

// Express session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: Date.now() + 300000 },
        name: 'uniqueSessionID',
        saveUninitialized: false,
        resave: false,
    }),
);

app.use(flasher());

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Route if user is logged in.
app.get('/home', (req, res) => {
    if (req.session.userId) {
        User.findOne({ _id: req.session.userId }, function (err, user) {
            res.render('home', {
                user: user,
            });
        });
    } else {
        req.flash('exists', 'You are logged out, log back in again');
        res.redirect('/login');
    }
});

// Login route
app.get('/login', (req, res) => {
    res.render('login');
});

// Register route
app.get('/register', (req, res) => {
    res.render('register');
});

// Discover new books route
app.get('/ontdekken', (req, res) => {
    if (req.session.userId) {
        User.findOne({ _id: req.session.userId }, function (err, user) {
            res.render('ontdekken', {
                user: user,
            });
        });
    } else {
        req.flash('exists', 'You are logged out, log back in again');
        res.redirect('/login');
    }
});

// Watch my books route
app.get('/mijn-matches', (req, res) => {
    if (req.session.userId) {
        User.findOne({ _id: req.session.userId }, function (err, user) {
            res.render('my_matches', {
                user: user,
            });
        });
    } else {
        req.flash('exists', 'You are logged out, log back in again');
        res.redirect('/login');
    }
});

// Watch my profile route
app.get('/profile', (req, res) => {
    if (req.session.userId) {
        User.findOne({ _id: req.session.userId }, function (err, user) {
            res.render('profile', {
                user: user,
            });
        });
    } else {
        req.flash('exists', 'You are logged out, log back in again');
        res.redirect('/login');
    }
});

// Registering a user
// app.post('/registerUser', async (req, res) => {
//     try {
//         User.findOne({ email: req.body.email }, async function (err, user) {
//             if (user) {
//                 console.log('User already exists in our database');
//                 req.flash('exists', 'Email already exists in our database');
//                 res.redirect('/login');
//                 return;
//             } else {
//                 const hashedPassword = await bcrypt.hash(req.body.password, 14);
//                 const userJson = {
//                     email: req.body.email,
//                     password: hashedPassword,
//                     firstName: req.body.firstName,
//                     lastName: req.body.lastName,
//                 };

//                 const newUser = new User(userJson);
//                 await newUser.save();

//                 // Nodemailer to sent registration email to user
//                 let transporter = nodemailer.createTransport({
//                     service: 'hotmail',
//                     secureConnection: false,
//                     port: 587,
//                     secure: false, // true for 465, false for other ports
//                     auth: {
//                         user: `${process.env.MAIL_USER}`,
//                         pass: `${process.env.MAIL_PASS}`,
//                     },
//                     tls: {
//                         ciphers: 'SSLv3',
//                     },
//                 });

//                 const msg = {
//                     from: `${process.env.MAIL_ADRES}`, // sender address
//                     to: `${req.body.email}`, // list of receivers
//                     attachments: [
//                         {
//                             filename: 'Puppy.png',
//                             path: './public/images/puppy.jpg',
//                             cid: 'uniquePuppyImage.jpg',
//                         },
//                     ],
//                     subject: `Welcome at KASJMatches: ${req.body.firstName} ${req.body.lastName}`, // Subject line
//                     text: `Welcome ${req.body.firstName} ${req.body.lastName} to KAJSMatches, and thank you for registering!`, // plain text body
//                     html: `<h1>Thanks! ${req.body.firstName} for registering to KAJSMatches.</h1>
//                         <h2>We hope that you enjoy your time with us</h2>
//                         <p>Here a puppy for you to brighten up your day!</p>
//                         <img src='cid:uniquePuppyImage.jpg'>`,
//                 };

//                 await transporter.sendMail(msg, function (err, info) {
//                     if (err) {
//                         console.log(err);
//                         return;
//                     }
//                     console.log('Email sent!');
//                 });
//                 req.flash('exists', 'E-mail has been send as a confirmation that you"ve registered');
//                 res.redirect('/login');
//                 return;
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(404).render('404', {
//             url: req.url,
//             title: 'Error 404',
//         });
//     }
// });

// Logging in a user
app.post('/loginUser', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        User.findOne({ email: email }, function (err, user) {
            if (user) {
                bcrypt
                    .compare(password, user.password)
                    .then((isSuccessful) => {
                        if (isSuccessful) {
                            req.session.userId = user._id;
                            req.flash('exists', 'Welcome back!');
                            res.redirect('/home');
                            return;
                        } else {
                            console.log('Wrong password entered');
                            req.flash('exists', 'You have entered a wrong password');
                            res.redirect('/login');
                            return;
                        }
                    })
                    .catch(console.log('Wrong password'));
            } else {
                console.log('User not found');
                req.flash('exists', 'We didn"t find you in our database, register instead');
                res.redirect('/login');
                return;
            }
        });
    } catch (error) {
        console.log('Login failed ' + error);
    }
});

// Matching feature
// TODO: Need to change to books
app.get('/ontdekken', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(404).render('404');
        } else {
            const filteredUsers = users.filter((user) => {
                if (
                    !(
                        loggedInUser.matched.includes(user._id.toString()) ||
                        loggedInUser.ignored.includes(user._id.toString())
                    )
                ) {
                    return user;
                }
            });
            let matchedBoeken = [];
            for (const user of filteredUsers) {
                let count = 0;
                for (const interest of user.codeInterests) {
                    if (loggedInUser.codeInterests.includes(interest)) {
                        count++;
                    }
                    if (count >= 2) {
                        matchedBoeken.push(user);
                        break;
                    }
                }
            }

            if (matchedUsers.length === 0) {
                res.render('ontdekken_empty', {
                    title: 'Boeken ontdekken',
                    empty: 'Oeps! Het lijkt erop dat je niet gematched bent aan een boek.',
                });
            } else {
                res.render('ontdekken', {
                    title: 'Boeken ontdekken',
                    boeken: matchedBoeken,
                    aantalMatches: matchedUsers.length,
                });
            }
        }
    });
});

// TODO: Need to change to my book matches
app.get('/mijn-matches', (req, res) => {
    let matchedUsers = [];
    loggedInUser.matched.forEach((user) => {
        matchedUsers.push(user);
    });
    User.find(
        {
            _id: { $in: matchedUsers },
        },
        (err, users) => {
            if (err) {
                console.log(err);
                res.redirect('/');
            } else {
                if (matchedUsers.length === 0) {
                    res.render('my_matches_empty', {
                        title: 'Mijn Matches',
                        empty: 'Oeps! Het lijkt erop dat je nog geen matches hebt geaccepteerd.',
                    });
                } else {
                    res.render('my_matches', {
                        title: 'Mijn Matches',
                        boeken: users,
                    });
                }
            }
        },
    );
});

// Booting app
app.listen(port, () => {
    console.log(chalk.blueBright(`Example app listening at http://localhost:${port}`));
});
