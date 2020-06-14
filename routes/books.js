const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require('../models').Sequelize;



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

// Add in search functionality

router.post('/search', asyncHandler(async(req, res) => {
  let search = true;
  if(search === true){
    const books = await Book.findAll({
      where: {
        [Op.or]: {
          title: {
            [Op.like]: `%${req.body.search}%`
          },
          author: {
            [Op.like]: `%${req.body.search}%`
          },
          genre: {
            [Op.like]: `%${req.body.search}%`
          },
          year: {
            [Op.like]: `%${req.body.search}%`
          }
        }
      }
    })
    res.render("books/index", { books })
  } else {
    res.render("books/book-not-found")
  }
  
}));

/*Get all book for index page. */

router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({order: [["title", "DESC"]]})
  res.render("books/index", { books, title: "SQL Library" } );
}));

router.get('/new', asyncHandler(async (req,res) => {
  res.render("books/new-book", {book: {}})
}));


/* Update the book list with the new book info. */

router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
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
    res.render("books/page-not-found");
  }
}));

/* Update a book. */

router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books"); 
    } else {
      res.render("books/page-not-found");
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

/* Delete individual book. */

router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.render("books/page-not-found");
  }
}));


module.exports = router;