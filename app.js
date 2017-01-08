const express = require('express');
const app = express();
const url = require('url');
const path = require('path');
const validUrl = require('valid-url');
var userURL; // URL submitted by user

app.use('/static', express.static(path.join(__dirname, 'public')));



app.get('/', function(req, res) {
        res.sendfile(path.join(__dirname + '/public/index.html'));
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