var express = require('express');
var app = express();
var url = require('url');
var validUrl = require('valid-url');
var userURL; // URL submitted by user

app.get('/', function(req, res) {
        res.send('Send a URL');
});

app.get('/*', function(req, res) {
  userURL = url.parse(req.url, true).path.slice(1);
  if (validUrl.isUri(userURL)){
        res.send('Looks like an URI');
    } else {
        res.send('Not a URI');
    }
});
  


app.listen(process.env.PORT, process.env.IP, function() {
  console.log("URL shortener listening on port " + process.env.PORT);
});