const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { csrfSync } = require('csrf-sync');
const flash = require('connect-flash');
const multer = require('multer');

const User = require('./models/user');
const { shopRoutes } = require('./routes/shop');
const { adminRoutes } = require('./routes/admin');
const { authRoutes } = require('./routes/auth');
const { get404, get500 } = require('./controllers/errors');

const { MONGODB_URI, MONGODB_DB_NAME, PORT, SESSION_SECRET, CSRF_SECRET } =
  process.env;

const app = express();
const store = new MongoDBStore({ uri: MONGODB_URI, collection: 'sessions' });

const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) =>
    req.body['CSRFToken'] || req.headers('x-csrf-token')
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'data/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}_${file.originalname}`);
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
    console.log('false');

    cb(null, false);
  }
};

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data/images', express.static(path.join(__dirname, 'data/images')));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
  })
);

app.use(csrfSynchronisedProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session?.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      return next(new Error(err));
    });
});

app.use('/manage', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', get500);
app.use(get404);

app.use((err, req, res, next) => {
  console.log('express error => ', err);
  res.redirect('/500');
});

mongoose
  .connect(MONGODB_URI, { dbName: MONGODB_DB_NAME })
  .then((result) => {
    app.listen(PORT, () => {
      console.log('Server listening on port', PORT);
    });
  })
  .catch((err) => console.log('mongoose.connect()', err));
