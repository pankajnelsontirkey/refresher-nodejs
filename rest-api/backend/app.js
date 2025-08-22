const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const { MONGODB_URL } = require('./utils/constants');

const PORT = 8080;

const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const { statusCode, message } = error;
  res.status(statusCode || 500).json({ message });
});

mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  })
  .catch((err) => console.log('Mongodb error: ', err));
