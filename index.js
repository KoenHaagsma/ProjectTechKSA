const express = require('express');
const chalk = require('chalk');
require('dotenv').config();
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

// Connecting mongoose
const connectDBMongoose = require('./models/mongoose');

connectDBMongoose();

// Load view engine | Path: Directory name + map name.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.basedir = app.get('views');

// Home route
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/ontdekken', (req, res) => {
    res.render('my_matches');
});

// Need to change to books
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

app.get('/mijn-matches', (req, res) => {
    res.render('my_matches');
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

// Handling 404
// TODO: Even kijken of ik use moet gebruiken of iets anders.
app.use((req, res, next) => {
    res.status(404).render('404');
    next();
});

app.get("/register", (req, res) => {
   res.render("pages/register", {
       title: "Register",
   })
});

app.get("/login", (req, res) => {
   res.render("pages/login", {
       title: "Login",
   })
});

app.get("/delete", (req, res) => {
   res.render("pages/delete", {
       title: "Delete account",
   })
});

app.get("/home", (req, res) => {
   res.render("pages/home", {
       title: "Logged in",
   })
});

app.get("/update", (req, res) => {
   res.render("pages/update", {
       title: "Update data",
   })
});

// Functies om de app te gebruiken
app.post("/registerUser", async (req, res) => {
   try {
      const newUser = new User ({
         email: req.body.email,
         password: req.body.password
      })
      await newUser.save()
      res.redirect("/home")
      return;

   } catch (error) {
      console.log(error);
      res.status(404).render("pages/404", {
          url: req.url,
          title: "Error 404",
      })
   }
});


app.post("/loginUser", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
    try {
      User.findOne({email: email}, function(err, user) {
        if(user){
          if(user.password == password){
            console.log("Logged in");
            res.redirect("/home")
            return;
          } else {
              console.log("Wrong password");
          }
        }
        console.log("User not found");
        res.redirect("/login")
        return;
      })
    } catch(error) {
      console.log("Login failed " + error)
    }
});


app.post("/updateUser", (req, res) => {
  User.findOneAndUpdate({email: req.body.email}, {email: req.body.newEmail}, {new: true}, (error, data) => {
    if (error) {
      console.log(error)
    } else {
      res.redirect("/home")
    }
  })
});


app.post("/deleteUser", async (req, res) => {
  User.findOneAndDelete({email: req.body.email}, (error, data) => {
    if (error){
      console.log(error)
    } else {
      res.redirect("/register")
    }
  })
});

// Booting app
app.listen(port, () => {
    console.log(chalk.blueBright(`Example app listening at http://localhost:${port}`));
});
