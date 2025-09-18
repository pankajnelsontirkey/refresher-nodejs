const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feed');
const { init } = require('./socket');
const { MONGODB_URL, PORT } = require('./utils/constants');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + new Date().toISOString());
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const { statusCode, message, data } = error;
  res.status(statusCode || 500).json({ message, data });
});

mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });

    const io = init(server);

    io.on('connection', (socket) => {
      console.log('Client connected.');
    });
  })
  .catch((err) => console.log('Mongodb error: ', err));
