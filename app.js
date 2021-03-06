const express = require('express');
const app = express();
const url = require('url');
const path = require('path');
const validUrl = require('valid-url');
const shortid = require('shortid');
const mongoClient = require('mongodb').MongoClient;


var userURL; // URL submitted by user
var tempShortURL;
var mongodbURL = process.env.MONGOLAB_URI;
var JSONResponse;

function insertNewURLIntoDatabase(newURL, shortURL) {
  var newLinkReference = {
    URL: newURL,
    shortURL: shortURL
  };
  mongoClient.connect(mongodbURL, function(err, db) {
    if (err) throw err;
    var collection = db.collection('storedLinks');
    collection.insert(newLinkReference, function(err, data) {
      if (err) throw err;
      console.log(JSON.stringify(newLinkReference));
      db.close();
    });
  });
}

function getURLFromShortURL(shortURL, callback){
  mongoClient.connect(mongodbURL, function(err, db) {
    if (err) throw err;
    var collection = db.collection('storedLinks');
    db.collection('storedLinks').findOne({shortURL: shortURL}, function(err, documents) {
      if (err) throw err;
      callback(documents.URL);
      db.close();
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
      JSONResponse = {
        original_url : userURL,
        short_url: "https://url-shortener-88.herokuapp.com/" + tempShortURL
      };
      res.send(JSON.stringify(JSONResponse));
    }
    else {
      res.send('Not a valid URL');
    }
  }
  else if(userURL === 'favicon.ico'){
    //Do nothing
    res.end();
  }
  else {
    getURLFromShortURL(userURL, function(databaseURL){
       if(databaseURL){
      res.redirect(databaseURL);
    }
    else {
      res.send("Database could not find link.");
    }
    });
  }
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("URL shortener listening on port " + process.env.PORT);
});