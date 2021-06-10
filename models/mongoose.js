const mongoose = require('mongoose');
const chalk = require('chalk');
console.log(process.env.DB_USER);
const connectDBMongoose = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r187e.mongodb.net/Cluster0?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            }
        );
        console.log(chalk.greenBright('Connection with the database established'));
    } catch (error) {
        console.log(chalk.redBright(`an error occurred: ${error}`));
        throw error;
    }
};

module.exports = connectDBMongoose;
