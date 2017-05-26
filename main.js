// we need the http server and are going to set the port at a default 3000
var express = require('express')
var fs = require('fs');

// a simple TeX-input example
var mathjax = require("mathjax-node-svg2png");
mathjax.config({
  MathJax: {}
});

// start the mathjax api
mathjax.start();

// load the index.html file into memory
page = fs.readFileSync('index.html', 'utf8');

// we start the app
var app = express();

// we want the basic, nothin version for the html
app.get('/', function(req, res) {
  res.send(page);
});

// we want the basic, nothin version for the html
app.get('/render', function(req, res) {
  // we need to decode the url
  math = decodeURIComponent(req.query.tex);
  scale = parseFloat(decodeURIComponent(req.query.scale));

  // done if no length
  if (math.length == 0) return;

  // if the scale is undefined, we set it
  if (req.query.scale === undefined) scale = 1;

  // typeset it 
  mathjax.typeset({
    math: math,
    format: "TeX", // we always use TeX (I love it)
    png: true, //  we create a png
    scale: scale
  }, function(data) {
    // we always assume it goes correctly for now
    base64 = data.png.substr(22)
    png = new Buffer(base64, 'base64')
    res.setHeader('Content-Type', 'image/png');
    res.end(png);
  });
});

// let the app listen
app.listen(5000);