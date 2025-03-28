const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('First middleware');
  next();
});

app.use((req, res, next) => {
  // res.send('<p>Response from second middleware</p>');
  next();
});

app.use('/users', (req, res) => {
  res.send('<p>Some dummy response</p>');
});

app.use('/', (req, res) => {
  res.send('<p>Welcome to the root route</p>');
});

app.listen(3000);
