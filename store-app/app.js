const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const { shopRoutes } = require('./routes/shop');
const { adminRoutes } = require('./routes/admin');
const { get404 } = require('./controllers/errors');
const mongoDbConnect = require('./util/database_mongodb').mongoDbConnect;

const app = express();

const { PORT } = process.env;

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
// User.findByPk(1)
//   .then((user) => {
//     req['user'] = user;
// next();
//   })
//   .catch((err) => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoDbConnect(() => {
  app.listen(PORT, () => {
    console.log('Server listening on port ', PORT);
  });
});
