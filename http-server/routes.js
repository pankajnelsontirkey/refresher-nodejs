const fs = require('fs');

const requestHandler = (req, res) => {
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
};

// module.exports = requestHandler;

module.exports = { handler: requestHandler };

// module.exports.handler = requestHandler;
// exports = { handler: requestHandler };
