const mongoose = require('mongoose')
const Schema = mongoose.Schema

const boek = new Schema({
    id: Schema.Types.ObjectId, 
    titel: String,
    auteur: String,
    genre: String,
    entryDate: Date

})

module.exports = boek