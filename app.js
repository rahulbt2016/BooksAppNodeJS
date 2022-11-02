/*********************************************************************************************
* ITE5315 – Assignment 2 
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source 
* (including web sites) or distributed to other students. 
* 
* Name: Rahul Tiwari 		Student ID: N01416281 	Date: 30/10/2022 
* 
* ********************************************************************************************/


// Import express
var express = require('express');
// Import path module, to work with file and directory paths
var path = require('path');
// Initialize express app
var app = express();

//Add Express-Handlebars (template engine) to the project
const exphbs = require('express-handlebars');
//Setting port number
const port = process.env.port || 3000;

//Set root folder for serving static assets
app.use(express.static(path.join(__dirname, 'public')));

// Initialize built-in middleware for urlencoding and json
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Setting up the Express-Handlebars template engine and initializing '.hbs' as its file extension
//Also adding helpers
app.engine('.hbs', exphbs.engine({ extname: '.hbs',
                                   helpers: {

                                    checkInventory: function(inventory) {

                                      if (inventory <= 0)
                                        return "Out of stock";
                                      else
                                        return inventory;
                                    },

                                    highlightCheck: function (book, options) {

                                      if(book.inventory <= 0) {
                                        return "<tr class='active-row'>" + options.fn(this) + "</tr>";
                                      }
                                      else {
                                        return "<tr>" + options.fn(this) + "</tr>";
                                      }
                                    }
                                   }
                                  }));
app.set('view engine', 'hbs');

//Routes
//Root (/) route 
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });  //Render index.hbs
});

//(/users)
app.get('/users', function(req, res) {
  res.send('respond with a resource');    
});

//(/data)
app.get('/data', function(req, res) {
  
  const fs = require('fs');
  let jsonData = fs.readFileSync('./public/dataset.json');
  let data = JSON.parse(jsonData);

  res.render('data', { data: JSON.stringify(data) });

});

//(/data/isbn/:index)
app.get('/data/isbn/:index', function(req, res) {
    
  const fs = require('fs');
  let jsonData = fs.readFileSync('./public/dataset.json');
  let data = JSON.parse(jsonData);

  let i = req.params['index'];
  if(typeof data[i] != 'undefined') {
      
    res.render('isbnIndex', { data: data[i]['ISBN'], index: i});
  }
  else {
    res.render('isbnIndex', { data: 'Invalid index entered!', index: i});
  }

});

//(/data/search/isbn)
app.get('/data/search/isbn', (req, res) => {

  res.render('isbnSearchForm');
})

app.post('/data/search/isbn', function (req, res) {

  let isbn = (req.body)['isbn'];

  const fs = require('fs');

  let jsonData = fs.readFileSync('./public/dataset.json');
  let data = JSON.parse(jsonData);
  let flag = false;
  let bookIndex = -1;

  for(let i = 0; i < data.length; i++) {

      if(data[i]['ISBN'] == isbn) {
          flag = true;
          bookIndex = i;
          break;
      }
  }

  res.render('isbnSearchData', { data: data[bookIndex], flag: flag});
});

//(/data/search/title)
app.get('/data/search/title', (req, res) => {

  res.render('titleSearchForm');
})

app.post('/data/search/title', function (req, res) {

  let title = (req.body)['title'].toLowerCase();

  const fs = require('fs');

  let jsonData = fs.readFileSync('./public/dataset.json');
  let data = JSON.parse(jsonData);
  let bookArray = [];

  for(let i = 0; i < data.length; i++) {

      if(data[i]['title'].toLowerCase().includes(title)) {
          
          bookArray.push(data[i]);
      }
  }

  res.render('titleSearchData', { data: bookArray, hasBook: (bookArray.length > 0)});  

});

//(/allData)
app.get('/allData', (req, res) => {

  const fs = require('fs');

  let jsonData = fs.readFileSync('./public/dataset.json');
  let data = JSON.parse(jsonData);

  res.render('allData', {data: data});
})


//(/noAuthorBooks)
app.get('/noAuthorBooks', (req, res) => {

  const fs = require('fs');

  let jsonData = fs.readFileSync('./public/dataset.json');
  let data = JSON.parse(jsonData);

  res.render('noAuthorBooks', {data: data});
})

//Wrong route
app.get('*', function(req, res) {
  res.render('error', { title: 'Error', message:'Wrong Route' });   //Render error.hbs
});

//Applicaion is listening the requests on the given port (3000)
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
