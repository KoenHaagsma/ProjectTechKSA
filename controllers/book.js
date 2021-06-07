const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const book = new Schema({
    id: Schema.Types.ObjectId,
    titel: String,
    auteur: String,
    genre: String,
    entryDate: Date,
});

module.exports = book;
