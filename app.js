const http = require('http');
const fs = require('fs');
const { error } = require('console');

// function reqListener(req, res) {}
// http.createServer(reqListener);

// http.createServer(function (req, res) {});

const server = http.createServer((req, res) => {
  // console.log('req', req.url, req.method, req.headers);

  const { url, method } = req;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</buttton></form></body>'
    );
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];

      fs.writeFile('message.txt', message, (error) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>NodeJS HTTP Server</title></head>');
  res.write('<body><h 1>NodeJs http server response...</h1></body>');
  res.write('</html>');
  res.end();

  // process.exit();
});

server.listen(3000, () => {});
