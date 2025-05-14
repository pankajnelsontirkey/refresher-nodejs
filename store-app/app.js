const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

const { shopRoutes } = require('./routes/shop');
const { adminRoutes } = require('./routes/admin');
const { authRoutes } = require('./routes/auth');

const { get404 } = require('./controllers/errors');

const {
  MONGODB_URI,
  MONGODB_DB_NAME,
  DUMMY_USER_USERNAME,
  DUMMY_USER_EMAIL,
  PORT,
  SESSION_SECRET
} = process.env;

const app = express();
const store = new MongoDBStore({ uri: MONGODB_URI, collection: 'sessions' });

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { maxAge: 60 * 60 * 2 },
    store
  })
);

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

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

mongoose
  .connect(MONGODB_URI, { dbName: MONGODB_DB_NAME })
  .then((result) => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       username: DUMMY_USER_USERNAME,
    //       email: DUMMY_USER_EMAIL
    //     });
    //     user.save();
    //   }
    // });

    app.listen(PORT, () => {
      console.log('Server listening on port ', PORT);
    });
  })
  .catch((err) => console.log('mongoose.connect()', err));
