const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDBMongoose = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster.hblwp.mongodb.net/MatchingApp?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            }
        );
        console.log(chalk.greenBright("Connection with the database established"));
    } catch (error) {
        console.log(chalk.redBright(`an error occurred: ${error}`));
        throw error;
    }
};

module.exports = connectDBMongoose;
