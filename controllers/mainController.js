const express = require('express');
const saveData = require('./modules/addBook');
// middleware voor endpoints. nodig om dit extern
const router = express.Router();
const getBooks = require('./modules/getBooks');


router.get('/addabook', (req, res) => {
    res.render('addBook');
   
 });

router.post('/addabook', (req, res) => {
    const data = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
    };
    saveData(data);
    res.render('addBook');
});

router.get('/myProfile', async (req, res) => {
    res.render('myProfile', {
        books: await getBooks()
    });
});


module.exports = router