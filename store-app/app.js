const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./util/database');

const { get404 } = require('./controllers/errors');
const { adminRoutes } = require('./routes/admin');
const { shopRoutes } = require('./routes/shop');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

db.execute('SELECT * FROM products')
  .then((data) => {
    console.log('data', data[0]);
  })
  .catch((err) => {
    console.log('err while reading from database', err);
  });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(get404);

app.listen(3000);
