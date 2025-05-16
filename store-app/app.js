const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/user');
const { shopRoutes } = require('./routes/shop');
const { adminRoutes } = require('./routes/admin');
const { authRoutes } = require('./routes/auth');
const { get404 } = require('./controllers/errors');

const { MONGODB_URI, MONGODB_DB_NAME, PORT, SESSION_SECRET, CSRF_SECRET } =
  process.env;

const app = express();
const store = new MongoDBStore({ uri: MONGODB_URI, collection: 'sessions' });

const csrfProtection = csrf();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
  })
);

app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session?.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(get404);

mongoose
  .connect(MONGODB_URI, { dbName: MONGODB_DB_NAME })
  .then((result) => {
    app.listen(PORT, () => {
      console.log('Server listening on port', PORT);
    });
  })
  .catch((err) => console.log('mongoose.connect()', err));
