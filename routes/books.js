const express = require('express');
const router = express.Router();
const Book = require('../models').Book;



/* Handler function to wrap each route. */

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

/*Get all book for index page. */

router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({order: [["title", "DESC"]]})
  res.render("books/index", { books, title: "Books" } );
}));

router.get('/new', asyncHandler(async (req,res) => {
  res.render("books/new-book", {book: {}})
}));

router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    article = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      article = await Book.build(req.body);
      res.render("books/new-book", { books, errors: error.errors, })
    } else {
      throw error;
    }  
  }
}));

module.exports = router;