const express = require('express');
const chalk = require('chalk');
require('dotenv').config();
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./models/passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email)
);

// Initializing app
const app = express();
const port = process.env.PORT || 3000;

// Connecting mongoose
const connectDBMongoose = require('./models/mongoose');
connectDBMongoose();

// Loading in user models
const User = require('./controllers/User');
const Book = require('./controllers/Book');

// Load view engine | Path: Directory name + map name.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.basedir = app.get('views');

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

// Serving static files (CSS, IMG, JS, etc.)
app.use('/assets', express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local', {
  succesRedirect: '/home',
  failureRedirect: '/',
  failureFlash: true
}));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
    });
});

app.get('/ontdekken', (req, res) => {
    res.render('my_matches');
});

app.get('/mijn-matches', (req, res) => {
    res.render('my_matches');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

// Add a book feature
const controller = require('./controllers/addBook');
app.use('/', controller);

app.get('/addabook', (req, res) => {
    res.render('addBook');
});

app.post('/addabook', (req, res) => {
    const data = {
        titel: req.body.titel,
        auteur: req.body.auteur,
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

// Need to change to my book matches
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

// Register/login user
app.post('/registerUser', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const userJson = {
          email: req.body.email,
          password: hashedPassword
        }
        const newUser = new User(userJson);
        await newUser.save();
        res.redirect('/');
        return;
    } catch (error) {
        console.log(error);
        res.status(404).render('404', {
            url: req.url,
            title: 'Error 404',
        });
    }
});

app.post('/loginUser', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        User.findOne({ email: email }, function (err, user) {
            if (user) {
                if (user.password === password) {
                    console.log('Logged in');
                    res.redirect('/home');
                    return;
                } else {
                    console.log('Wrong password');
                }
            }
            console.log('User not found');
            res.redirect('/');
            return;
        });
    } catch (error) {
        console.log('Login failed ' + error);
    }
});

// Update user
app.post('/updateUser', (req, res) => {
    User.findOneAndUpdate({ email: req.body.email }, { email: req.body.newEmail }, { new: true }, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/home');
        }
    });
});

// Delete user
app.post('/deleteUser', async (req, res) => {
    User.findOneAndDelete({ email: req.body.email }, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/register');
        }
    });
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
