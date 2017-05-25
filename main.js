// we need the http server and are going to set the port at a default 3000
const http = require('http')
const port = 3000

// a simple TeX-input example
var mathjax = require("mathjax-node-svg2png");
mathjax.config({
    MathJax: {}
});

// start the mathjax api
mathjax.start();

// make the request handler
const requestHandler = (request, response) => {
    // remove starting /
    url = request.url.substr(1);

    // we need to decode the url
    math = decodeURI(url);

    // typeset it 
    mathjax.typeset({
        math: math,
        format: "AsciiMath", // we always use AsciiMath, because we are limited
        png: true, //  we create a png
        scale: 2
    }, function (data) {
        console.log(data.errors)
        console.log(math)
        // we always assume it goes correctly for now
        base64 = data.png.substr(22)
        png = new Buffer(base64, 'base64')
        response.setHeader('Content-Type', 'image/png');
        response.end(png);
    });
}

// make the server
const server = http.createServer(requestHandler)

// now listen on the server
server.listen(port, (err) => {
    if (err) return console.log('We cannot start up for some reason...', err)
})
