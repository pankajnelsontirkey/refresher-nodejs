const { greeting, users, form } = require('./markup');

const handler = (req, res) => {
  const { url, method } = req;

  res.setHeader('Content-Type', 'text/html');
  if (url === '/') {
    res.write(greeting);
    res.end();
  }

  if (url === '/users') {
    res.write(users);
    res.end();
  }

  if (url === '/create-user') {
    if (method === 'GET') {
      res.write(form);
      return res.end();
    }
    if (method === 'POST') {
      const body = [];

      req.on('data', (chunk) => {
        body.push(chunk);
      });

      req.on('end', () => {
        const username = Buffer.concat(body).toString().split('=')[1];
        console.log(username);

        res.setHeader('Location', '/');
        return res.end();
      });
    }
  }
};

module.exports = { handler };
