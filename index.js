const express = require('express');
const chalk = require('chalk');
require('dotenv').config();
const path = require('path');

// Initializing app
const app = express();
const port = process.env.PORT || 3000;

// Connecting mongoose
const connectDBMongoose = require('./models/mongoose');

connectDBMongoose();

// Load view engine | Path: Directory name + map name.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.locals.basedir = app.get('views');

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

// Serving static files (CSS, IMG, JS, etc.)
app.use('/assets', express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
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
        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
        });
        await newUser.save();
        res.redirect('/home');
        return;
    } catch (error) {
        console.log(error);
        res.status(404).render('pages/404', {
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
                if (user.password == password) {
                    console.log('Logged in');
                    res.redirect('/home');
                    return;
                } else {
                    console.log('Wrong password');
                }
            }
            console.log('User not found');
            res.redirect('/login');
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
