const express = require('express');
const chalk = require('chalk');
require('dotenv').config();
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const nodemailer = require('nodemailer');

// Initializing app
const app = express();
const port = process.env.PORT;

// Connecting mongoose
const connectDBMongoose = require('./models/mongoose');


connectDBMongoose();

// Loading in user models
const User = require('./schema/User');
const Book = require('./schema/Book');


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
        res.redirect('/login');
    }
});

// Registering a user
app.post('/registerUser', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 14);
        const userJson = {
            email: req.body.email,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        };

        const newUser = new User(userJson);
        await newUser.save();

        // Nodemailer to sent registration email to user
        let transporter = nodemailer.createTransport({
            service: 'hotmail',
            secureConnection: false,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: `${process.env.MAIL_USER}`,
                pass: `${process.env.MAIL_PASS}`,
            },
            tls: {
                ciphers: 'SSLv3',
            },
        });

        const msg = {
            from: `${process.env.MAIL_ADRES}`, // sender address
            to: `${req.body.email}`, // list of receivers
            subject: `Welcome at KASJMatches: ${req.body.firstName} ${req.body.lastName}`, // Subject line
            text: `Welcome ${req.body.firstName} ${req.body.lastName} to KAJSMatches, and thank you for registering!`, // plain text body
        };

        await transporter.sendMail(msg, function (err, info) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Email sent!');
        });

        res.redirect('/login');
        return;
    } catch (error) {
        console.log(error);
        res.status(404).render('404', {
            url: req.url,
            title: 'Error 404',
        });
    }
});

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
                            res.redirect('/home');
                            return;
                        } else {
                            console.log('Wrong password entered');
                            res.redirect('/login');
                            return;
                        }
                    })
                    .catch(console.log('Wrong password'));
            } else {
                console.log('User not found');
                res.redirect('/login');
                return;
            }
        });
    } catch (error) {
        console.log('Login failed ' + error);
    }
});


// Add a book feature
const addBook = require('./controllers/addBook');
app.use('/', addBook);

app.get('/addabook', (req, res) => {
    res.render('addBook');
    console.log(addBook)
});

app.post('/addabook', (req, res) => {
    const data = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
    };
    saveData(data);
    res.render('addBook');
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

// Logging out the user
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {});
    console.log('User is logged out');
    res.redirect('/');
});

// Handling 404
// TODO: Even kijken of ik use moet gebruiken of iets anders.
app.use((req, res, next) => {
    res.status(404).render('404');
    next();
});

// Booting app
app.listen(port, () => {
    console.log(chalk.blueBright(`Example app listening at http://localhost:${port}`));
});
