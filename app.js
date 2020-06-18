var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var paginate = require('express-paginate');

var routes = require('./routes/index');
var books = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(paginate.middleware(10, 50));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("books/page-not-found")
  err.status = 404;
  next(err)
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if(err.status === 404) {
    res.render('books/page-not-found');
  } else {
    res.render('books/book-not-found');
  }
});

app.all(function(req, res, next) {
  // set default or minimum is 10 
  if (req.query.limit <= 10) req.query.limit = 10;
  next();
});

module.exports = app;
