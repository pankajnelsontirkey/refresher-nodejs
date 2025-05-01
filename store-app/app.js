const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./models/user');

const { get404 } = require('./controllers/errors');

const { shopRoutes } = require('./routes/shop');
const { adminRoutes } = require('./routes/admin');
const { authRoutes } = require('./routes/auth');

const {
  MONGODB_URL,
  MONGODB_DB_NAME,
  DUMMY_USER_USERNAME,
  DUMMY_USER_EMAIL,
  DUMMY_USER_OBJECTID,
  PORT,
  SESSION_SECRET
} = process.env;

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600 }
  })
);

app.use((req, res, next) => {
  if (req.user) {
    return next();
  }
  User.findById(DUMMY_USER_OBJECTID)
    .then((user) => {
      req['user'] = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

mongoose
  .connect(MONGODB_URL, { dbName: MONGODB_DB_NAME })
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          username: DUMMY_USER_USERNAME,
          email: DUMMY_USER_EMAIL
        });
        user.save();
      }
    });

    app.listen(PORT, () => {
      console.log('Server listening on port ', PORT);
    });
  })
  .catch((err) => console.log('mongoose.connect()', err));
