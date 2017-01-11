const express = require('express');
const app = express();
const url = require('url');
const path = require('path');
const validUrl = require('valid-url');
const shortid = require('shortid');
var userURL; // URL submitted by user
var shortURL; // Short URL generated

//app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendfile(path.join(__dirname + '/public/index.html'));
});

app.get('/*', function(req, res) {
  userURL = url.parse(req.url, true).path.slice(1);
  console.log("URL is: " + userURL);
  if (userURL.slice(0, 4) === 'new/') {
    console.log("after conditional: " + userURL);
    userURL = userURL.slice(4);
    console.log("after slice: " + userURL);
    if (validUrl.isUri(userURL)) {
      shortURL = shortid.generate();
      console.log(shortURL);
      res.send('Looks like an URI ' + '\n' +
        'Visit ' + shortURL + ' to be redirected');
    }
    else {
      console.log('not valid');
      res.send('Not a URI');
    }
  }
  else if (userURL === shortURL) {
    //res.redirect(userURL);
    res.send('Retrieve URL to send. No longer have it though!');
  }
  else {
    console.log('no conditionals true');
  }
  
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("URL shortener listening on port " + process.env.PORT);
});