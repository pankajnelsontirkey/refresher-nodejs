const http = require('http');

const { handler } = require('./routes');

// function reqListener(req, res) {}
// http.createServer(reqListener);

// http.createServer(function (req, res) {});

const server = http.createServer(handler);

server.listen(3000);
