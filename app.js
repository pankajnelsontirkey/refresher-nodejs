const http = require('http');

// function reqListener(req, res) {}
// http.createServer(reqListener);

// http.createServer(function (req, res) {});

const server = http.createServer((req, res) => {
  console.log('req', req);
  // process.exit();
});

server.listen(3000, () => {});
