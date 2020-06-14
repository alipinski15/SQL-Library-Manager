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


/* Update the book list with the new book info. */

router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/");
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors, })
    } else {
      throw error;
    }  
  }
}));

/* Retrieves book for updating or deleting */

router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/update-book", { book }); 
  } else {
    res.sendStatus(404);
  }
}));

/* Update an book. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await Book.update(req.body);
      res.redirect("/books/" + book.id); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct book gets updated
      res.render("/books/update-book", { book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));


module.exports = router;