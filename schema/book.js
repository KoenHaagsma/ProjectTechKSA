const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const book = new Schema(
    {
        title: String,
        author: String,
        genre: String,
        entryDate: Date,
    },
    { timestamps: true, typeKey: '$type' },
);

module.exports = book;
