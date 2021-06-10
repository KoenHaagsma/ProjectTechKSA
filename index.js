const express = require("express");
const chalk = require("chalk");
require("dotenv").config();
const app = express();

// Connecting mongoose
const connectDBMongoose = require("./controllers/mongoose");
connectDBMongoose();

// Home route
app.get("/", (req, res) => {
    res.send("Hello World!");
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
app.listen(process.env.PORT, () => {
    console.log(chalk.blueBright(`Example app listening at http://localhost:${process.env.PORT}`));
});
