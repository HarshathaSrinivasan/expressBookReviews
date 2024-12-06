const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  let userAvailable = false;
  users.forEach(item =>{
    if(item["username"] == username){
      userAvailable = true;
    }
  });

  if(username != null && password != null && !userAvailable){
  users.push({"username":username,
    "password":password
  });
  return res.status(200).json({message: "User successfully registered. Now you can login"});
  }else if(userAvailable){
    return res.status(404).json({message: "User already exists!"});
  }else{
    return res.status(404).json({message: "Unable to register user."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let foundItem;
  Object.entries(books).map(item => {
    if(item[1].author == author){
      foundItem = item;
    }
  });
  if(foundItem){
    res.send(foundItem);
  }else{
    res.send("Book not found");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let foundItem;
  Object.entries(books).map(item => {
    if(item[1].title == title){
      foundItem = item;
    }
  });
  if(foundItem){
    res.send(foundItem);
  }else{
    res.send("Book not found");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});


async function getListOfBooks(){
  let url = "http://localhost:5000/";
  let result = await axios.get(url);
}

async function getBooksOfIsbn(isbnNumber) {
  let url = "http://localhost:5000/isbn/"+isbnNumber;
  let result = await axios.get(url);
}

async function getBooksOfAuthor(authorName){
  let url = "http://localhost:5000/author/"+authorName;
  let result = await axios.get(url);
}

async function getBooksOfTitle(bookTitle){
let url = "http://localhost:5000/title/"+bookTitle;
let result = await axios.get(url);
console.log(result.data);
}

getListOfBooks();
getBooksOfIsbn(2);
getBooksOfAuthor("Jane Austen");
getBooksOfTitle("One Thousand and One Nights");

module.exports.general = public_users;
