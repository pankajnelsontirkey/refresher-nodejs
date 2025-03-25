const http = require('http');

// function reqListener(req, res) {}
// http.createServer(reqListener);

// http.createServer(function (req, res) {});

const server = http.createServer((req, res) => {
  // console.log('req', req.url, req.method, req.headers);
  // process.exit();
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>NodeJS HTTP Server</title></head>');
  res.write('<body><h1>NodeJs http server response...</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(3000, () => {});
