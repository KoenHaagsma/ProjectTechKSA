const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const nodemailer = require('nodemailer');
const flasher = require('express-flash');
require('dotenv').config();
const mongoose = require('mongoose');
// middleware for endpoints. needed to extern
const router = express.Router();

const getBooks = require('./modules/getBooks');
const saveData = require('./modules/addBook');

// Loading in user models
const User = require('../schema/user');
const books = require('../schema/book');
const Book = mongoose.model('book', books);

// Express session
router.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: Date.now() + 300000 },
        name: 'uniqueSessionID',
        saveUninitialized: false,
        resave: false,
    }),
);

router.use(flasher());

// Routes
router.get('/', (req, res) => {
    if (req.session.userId) {
        User.findOne({ _id: req.session.userId }, function (err, user) {
            res.render('home', {
                user: user,
            });
        });
    } else {
        req.flash('exists', 'You need to log in');
        res.redirect('/');
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('login');
});

// Register route
router.get('/register', (req, res) => {
    res.render('register');
});

// Route if user is logged in.
router.get('/home', (req, res) => {
    if (req.session.userId) {
        User.findOne({ _id: req.session.userId }, function (err, user) {
            res.render('home', {
                user: user,
            });
        });
    } else {
        req.flash('exists', 'You need to log back in again');
        res.redirect('/login');
    }
});

// Registering a user
router.post('/registerUser', async (req, res) => {
    try {
        User.findOne({ email: req.body.email }, async function (err, user) {
            if (user) {
                console.log('User already exists in our database');
                req.flash('exists', 'Email already exists in our database');
                res.redirect('/login');
                return;
            } else {
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
                    host: 'smtp.ethereal.email',
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
                    attachments: [
                        {
                            filename: 'Puppy.png',
                            path: './public/images/puppy.jpg',
                            cid: 'uniquePuppyImage.jpg',
                        },
                    ],
                    subject: `Welcome at KASJMatches: ${req.body.firstName} ${req.body.lastName}`, // Subject line
                    text: `Welcome ${req.body.firstName} ${req.body.lastName} to KAJSMatches, and thank you for registering!`, // plain text body
                    html: `<h1>Thanks! ${req.body.firstName} for registering to KAJSMatches.</h1>
                        <h2>We hope that you enjoy your time with us</h2>
                        <h3>You registered with: ${req.body.email}</h3>
                        <h3>Name entered: ${req.body.firstName} ${req.body.lastName}</h3>
                        <p>Here a puppy for you to brighten up your day!</p>
                        <img src='cid:uniquePuppyImage.jpg'>`,
                };

                await transporter.sendMail(msg, function (err, info) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log('Email sent!');
                });
                console.log();
                req.flash('exists', 'E-mail has been send as a confirmation that you"ve registered');
                res.redirect('/login');
                return;
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).render('404', {
            url: req.url,
            title: 'Error 404',
        });
    }
});

// Logging in a user
router.post('/loginUser', (req, res) => {
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
                            req.flash('exists', 'You"ve entered a wrong password');
                            res.redirect('/login');
                            return;
                        }
                    })
                    .catch(console.log(err));
            } else {
                console.log('User not found');
                req.flash('exists', 'We didn"t find you in our database');
                res.redirect('/login');
                return;
            }
        });
    } catch (error) {
        console.log('Login failed ' + error);
    }
});

// Logging out the user
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {});
    res.redirect('/login');
});

// Get addabook page
router.get('/addabook', (req, res) => {
    if (req.session.userId) {
        User.findOne({ _id: req.session.userId }, function (err, user) {
            res.render('addBook', {
                user: user,
            });
        });
    } else {
        req.flash('exists', 'You need to log back in again');
        res.redirect('/login');
    }
});

// Add a book to database
router.post('/addabook', async (req, res) => {
    const data = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
    };
    await saveData(data);

    try {
        Book.findOne()
            .sort({ $natural: -1 })
            .limit(1)
            .exec(function (err, book) {
                if (err) {
                    console.log('couldn"t find a book' + err);
                    req.flash('exists', 'Something went wrong');
                    res.redirect('/addabook');
                    return;
                } else {
                    User.findOneAndUpdate(
                        { _id: req.session.userId },
                        { $push: { genres: book._id } },
                        function (err, user) {
                            if (user) {
                                req.flash('exists', 'Book has been added to your account');
                                res.redirect('/addabook');
                                return;
                            } else {
                                console.log(err);
                            }
                        },
                    );
                }
            });
    } catch (err) {
        console.log('Something went wrong with finding the book' + err);
        res.redirect('/addabook');
    }
});

// Reads out list of books
router.get('/myProfile', async (req, res) => {
    if (req.session.userId) {
        User.findOne({ _id: req.session.userId }, async function (err, user) {
            res.render('myProfile', {
                books: await getBooks(),
            });
        });
    } else {
        req.flash('exists', 'You need to log back in again');
        res.redirect('/login');
    }
});

// Delete a book
// WIP
// router.post('/deleteBook', async (req, res) => {
//     try {
//         Book.deleteOne({
//             _id : req.body.id,
//         })
//         await Book.deleteOne()
//         res.render('myProfile', {
//             books: await getBooks()
//         })
//     } catch (error) {
//         if (err) return console.log(err)
//     }

// })

// Matching feature
// Discover new books
router.get('/ontdekken', (req, res) => {
    if (req.session.userId) {
        User.findOne({ _id: req.session.userId }, function (err, user) {
            if (err) {
                console.log('Error appeared in the database' + err);
            } else {
                Book.find(
                    { _id: { $in: user.genres.map((value) => mongoose.Types.ObjectId(value)) } },
                    (err, userBooks) => {
                        if (!userBooks.length) {
                            req.flash('exists', 'You did not fill in any books yet');
                            res.redirect('/addabook');
                        } else {
                            const genres = userBooks.map((book) => book.genre);
                            Book.find({ genre: { $in: genres } }, (err, books) => {
                                const booksFiltered = books.filter(
                                    (book) => !userBooks.map((b) => b._id.toString()).includes(book._id.toString()),
                                );
                                if (!booksFiltered.length) {
                                    req.flash('exists', 'You did not match with any books, add more books');
                                    res.redirect('/addabook');
                                } else {
                                    res.render('ontdekken', {
                                        books: booksFiltered,
                                    });
                                }
                            });
                        }
                    },
                );
            }
        });
    } else {
        req.flash('exists', 'You need to log back in again');
        res.redirect('/login');
    }
});

router.post('/book/:id', (req, res) => {
    User.findByIdAndUpdate(
        req.session.userId,
        {
            $push: { genres: req.body.add },
        },
        (err) => {
            if (err) {
                console.log('updating to the database has failed');
            } else {
                req.flash('exists', 'Book has been added to your books');
                res.redirect('/ontdekken');
            }
        },
    );
});

// Watch my books route
router.get('/mijn-matches', (req, res) => {
    if (req.session.userId) {
        User.findOne({ _id: req.session.userId }, function (err, user) {
            Book.find(
                { _id: { $in: user.genres.map((value) => mongoose.Types.ObjectId(value)) } },
                (err, userBooks) => {
                    if (!userBooks.length) {
                        res.render('my_matches_empty', {
                            title: 'You did not accept any matches or dont have any books added',
                        });
                    } else {
                        res.render('my_matches', {
                            books: userBooks,
                        });
                    }
                },
            );
        });
    } else {
        req.flash('exists', 'You need to log back in again');
        res.redirect('/login');
    }
});

// Handling 404
// TODO: Even kijken of ik use moet gebruiken of iets anders.
router.use((req, res, next) => {
    res.status(404).render('404');
    next();
});

module.exports = router;
