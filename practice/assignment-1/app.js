const http = require('http');

const { handler } = require('./requestHandler');

const server = http.createServer(handler);

server.listen(3000, () => {
  console.log(`server listening on port 3000...`);
});
