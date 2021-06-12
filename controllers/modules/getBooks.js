const mongoose = require('mongoose');
const books = require('../../schema/book');
const newBook = mongoose.model('book', books);

// gets books from db
async function getBooks() {
    // lean() transforms mongoose object to json object
    const data = await newBook.find().lean();
    return data;
}


module.exports = getBooks;
