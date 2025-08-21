const express = require('express');

const feedRoutes = require('./routes/feed');
const { CLIENT_URL } = require('./utils/constants');

const PORT = 8080;

const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', CLIENT_URL);
  res.header(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

app.use('/feed', feedRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
