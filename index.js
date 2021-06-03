const express = require("express");
const chalk = require("chalk");
require("dotenv").config();
const app = express();

// Connecting mongoose
const connectDBMongoose = require("./controllers/mongoose");
connectDBMongoose();

console.log(process.env.USER);
console.log(process.env.PASSWORD);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
    console.log(chalk.blueBright(`Example app listening at http://localhost:${process.env.PORT}`));
});
