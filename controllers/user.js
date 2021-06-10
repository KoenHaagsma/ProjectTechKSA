const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const book = new Schema(
    {
        email: String,
        password: String,
        matched: [String],
        ignored: [String],
        genres: [String],
        firstName: String,
        lastName: String,
    },
    { timestamps: true, typeKey: '$type' },
);

module.exports = book;
