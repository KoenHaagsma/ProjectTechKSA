const express = require('express');
// middleware voor endpoints. nodig om dit extern
const router = express.Router();

const mongoose = require('mongoose');
const boek = require('../schema/boek.schema');
const gebruiker = require('../schema/gebruiker.schema');

// collection, schema
const newBoek = mongoose.model('book', book);

// functie die data pakt en deze opslaat in mongoose
function saveData(data) {
    let newBook = new newBoek({
        titel: data.titel,
        auteur: data.auteur,
        genre: data.genre,
        entryDate: Date(),
    });

    newBook.save((err) => {
        console.log(`${newBook}`);
        if (err) return handleError(err);
    });
}

// functie die boekenlijst ophaalt
async function getBooks() {
    // lean() transforms mongoose object to json object
    const data = await newBoek.find().lean();
    return data;
}
