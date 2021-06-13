const mongoose = require('mongoose');
const books = require('../../schema/book');

// collection, schema
const newBook = mongoose.model('book', books);

// function that saves books in db
function saveData(data) {
    const newBooks = new newBook({
        title: data.title,
        author: data.author,
        genre: data.genre,
        entryDate: Date(),
    });

    newBooks.save((err) => {
        console.log(`${newBooks}`);
        if (err) return handleError(err);
    });
}

module.exports = saveData;
