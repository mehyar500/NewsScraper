// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const exphbs = require('express-handlebars');


// Initialize Express
const app = express();
var PORT = process.env.PORT || 3000;

// Configure middleware
// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Database Configuration with Mongoose
// ---------------------------------------------------------------------------------------------------------------
// Connect to localhost if not a production environment
if(process.env.NODE_ENV == 'production'){
  mongoose.connect('mongodb://heroku_tlcrzn3j:3jcrv387afn6crc88ugdo2tis5@ds231205.mlab.com:31205/heroku_tlcrzn3j');
}
else{
  mongoose.connect('mongodb://localhost/news-scraper');
  // YOU CAN IGNORE THE CONNECTION URL BELOW (LINE 41) THAT WAS JUST FOR DELETING STUFF ON A RE-DEPLOYMENT
  //mongoose.connect('mongodb://heroku_60zpcwg0:ubn0n27pi2856flqoedo9glvh8@ds119578.mlab.com:19578/heroku_60zpcwg0');
}

const db = mongoose.connection;

// Show any Mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

//importing all models
const models = require("./models");

// Routes
// =============================================================
require("./routes/route.js")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
