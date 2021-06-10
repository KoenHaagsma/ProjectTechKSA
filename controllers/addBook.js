const express = require('express');
// middleware voor endpoints. nodig om dit extern
const router = express.Router();
const mongoose = require('mongoose');
const books = require('./book');

// collection, schema
const newBook = mongoose.model('book', books);

// functie die data pakt en deze opslaat in mongoose
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

// gets books from db
async function getBooks() {
    // lean() transforms mongoose object to json object
    const data = await newBook.find().lean();
    return data;
}


router.post('/addabook', (req, res) => {
    const data = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
    };
    saveData(data);
    res.render('addBook');
});

router.get('/profile', async (req, res) => {
    res.render('profile', {
        books: await getBooks()
    });
    console.log(getBooks())
});

module.exports = router;
