const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { shopRoutes } = require('./routes/shop');
const { adminRoutes } = require('./routes/admin');
const { get404 } = require('./controllers/errors');
const User = require('./models/user');

const { MONGODB_URL, MONGODB_DB_NAME } = process.env;
let _db;

const app = express();

const { PORT, DUMMY_USER_OBJECTID } = process.env;

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // if (req.user) {
  //   return next();
  // }
  // User.findById(ObjectId.createFromHexString(DUMMY_USER_OBJECTID))
  //   .then((userData) => {
  //     const { username, email, cart, _id } = userData;
  //     req['user'] = new User(username, email, cart, _id);
  next();
  //   })
  //   .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoose
  .connect(MONGODB_URL, { dbName: MONGODB_DB_NAME })
  .then((result) => {
    app.listen(PORT, () => {
      console.log('Server listening on port ', PORT);
    });
  })
  .catch((err) => console.log('mongoose.connect()', err));
