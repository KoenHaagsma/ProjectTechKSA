const mongoose = require('mongoose');
const connectDBMongoose = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r187e.mongodb.net/Cluster0?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
                tlsInsecure: true,
            },
        );
        console.log('Connection with the database established');
    } catch (error) {
        console.log(`an error occurred: ${error}`);
        throw error;
    }
};

module.exports = connectDBMongoose;
