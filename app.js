const express = require('express');
const app = express();
const url = require('url');
const path = require('path');
const validUrl = require('valid-url');
const shortid = require('shortid');
const mongodb = require('mongodb').MongoClient;


var userURL; // URL submitted by user
var tempShortURL;
var mongodbURL = "mongodb://localhost:27017/url-shortener-microservice";

function insertNewURLIntoDatabase(newURL, shortURL) {
  var newLinkReference = {
    URL: newURL,
    shortURL: shortURL
  };

  mongodb.connect(mongodbURL, function(err, db) {
    if (err) throw err;
    var collection = db.collection('storedLinks');
    collection.insert(newLinkReference, function(err, data) {
      if (err) throw err;
      console.log(JSON.stringify(newLinkReference));
      db.close();
    });
  });
}

<<<<<<< HEAD
function getURLFromShortURL(shortURL){
  
  var localStoredURLValue;
=======
function getURLFromShortURL(shortURL, callback){
>>>>>>> callback-feature
  
  mongodb.connect(mongodbURL, function(err, db) {
    if (err) throw err;
    var collection = db.collection('storedLinks');
    db.collection('storedLinks').findOne({shortURL: shortURL}, function(err, documents) {
      if (err) throw err;
      console.log("Document URL is: " + documents);
      console.log("Document URL REALLY is: " + documents.URL);
<<<<<<< HEAD
      localStoredURLValue = documents.URL.toString();
      db.close();
      console.log("localStoredURLValue: " + localStoredURLValue);
      return localStoredURLValue;
=======
      callback(documents.URL);
      db.close();
>>>>>>> callback-feature
    });
  });
  
  
}

//app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendfile(path.join(__dirname + '/public/index.html'));
});

app.get('/*', function(req, res) {
  userURL = url.parse(req.url, true).path.slice(1);
  // Check if the URL begins with '/new'
  if (userURL.slice(0, 4) === 'new/') {
    userURL = userURL.slice(4);
    if (validUrl.isUri(userURL)) {
      tempShortURL = shortid.generate();
      insertNewURLIntoDatabase(userURL, tempShortURL);
       console.log("GETS to if statement");
      res.send('A short ID for your URL has been generated.' + '\n' +
        'To try the new URL, visit ' + tempShortURL + ' to be redirected');
    }
    else {
      //console.log('not valid');
      res.send('Not a valid URL');
    }
  }
  else if(userURL === 'favicon.ico'){
    //Do nothing
    res.end();
  }
  else {
<<<<<<< HEAD
    /*
    console.log("gets to else statement. URL is " + userURL);
    var redirectURL = getURLFromShortURL(userURL);
    console.log("redirect URL is: " + redirectURL);
    if(redirectURL){
      res.redirect(redirectURL);
=======
    //console.log("gets to else statement. URL is " + userURL);
    getURLFromShortURL(userURL, function(databaseURL){
       if(databaseURL){
      res.redirect(databaseURL);
>>>>>>> callback-feature
    }
    else {
      res.end();
    }
<<<<<<< HEAD
    */
     mongodb.connect(mongodbURL, function(err, db) {
    if (err) throw err;
    var collection = db.collection('storedLinks');
    db.collection('storedLinks').findOne({shortURL: userURL}, function(err, documents) {
      if (err) throw err;
      //console.log("Document URL is: " + documents);
      //console.log("Document URL REALLY is: " + documents.URL);
      //localStoredURLValue = documents.URL.toString();
      res.redirect(documents.URL);
      db.close();
      //console.log("localStoredURLValue: " + localStoredURLValue);
      //return localStoredURLValue;
    });
  });
    
    
    
    
    
=======
    });
    //console.log("redirect URL is: " + redirectURL);
   
>>>>>>> callback-feature
  }

});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("URL shortener listening on port " + process.env.PORT);
});