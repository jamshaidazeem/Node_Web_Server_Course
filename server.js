
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

// view engine setup, npmjs.com/package/hbs
app.set('view engine', 'hbs');

// setting up partials, to make reusable UI views like footer
hbs.registerPartials(__dirname + '/views/partials'); 

// setting up handle bar helpers to execute functions using handle bars
hbs.registerHelper('currentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

// middle ware, lets express do things differently and provide utility

// use custom middle ware
app.use((req, res, next) => {
    // this middle ware logs the time at which request is being made, method and path
    const log = `log: ${new Date().toString()} "method:" ${req.method} "path:" ${req.url}`;
    fs.appendFile('server.logs', log + '\n', (err) => {
        if (err) {
            console.log(err);
        } 
       next(); // continue to route handling function or next middle ware
    });
});

// middle ware for maintainence

/*
app.use((req, res, next) => {
    res.render('maintain.hbs', {
        customText: 'Sorry, website is currently in maintainence mode, come back soon!',
    });
});*/

// in order to serve a static resource we need its absolute path which could be changed
// so we use a built in middle ware to work with relevant path
app.use(express.static(__dirname + '/public'));

// listen for a get request on root path (route) e.g home page and on receive event, handler called
// with request and response arguments
app.get('/', (req, res) => { 
   // res.send('hello express');
   //  res.send('<h1>hello express</h1>');
  // res.send({name: 'Jamshaid', likes: ['cricket', 'gaming']});
  res.render('home.hbs', {
      pageTitle: 'Home',
      welcome: 'Welcome to our website',
  });
});

app.get('/about', (req, res) => {
   // res.send('about page');
   res.render('about.hbs', {
       pageTitle: "Dynamic About Title",
   });
});

app.get('/portfolio', (req, res) => {
    // res.send('about page');
    res.render('portfolio.hbs', {
        pageTitle: "Portfolio",
        welcome: 'Welcome to our portfolio',
    });
});

app.listen(port, () => {
    console.log(`server.js listening on port ${port}...`);
});