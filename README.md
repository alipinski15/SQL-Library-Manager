# SQL Library Manager
 
This is a simple application for a local Library to use to help them manage their collection of books.
The librarian has been using a simple SQLite database and has been entering data in manually. The librarian wants a more intuitive way to manage the library's collection of books.

In the app you are able to search, add, delete, and update a book. By clicking on the books title, you are able to update and delete. 
I also added custom error routing pages as well, if a user navigates to an incorrect url, book ID, or if a user searches for a book that doesn't exist, an error page will be shown. 

Technologies used:
  Javascript
  Node.js
  Express
  Pug
  SQL ORM Sequelize

The app.js file sets up all of the core technologies used in the app and sets up app.use for everything needed.

The books.js is where all the Javascript and routing are created. 

I added a search function and pagination links as an extra requirement to meet Exceeds Expectations.

I also created my own CSS stylesheet of customize the look and placement of elements. 

I hope you enjoy.