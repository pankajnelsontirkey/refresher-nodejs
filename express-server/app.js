const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const { engine } = require('express-handlebars');

const { router: adminRoutes } = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// app.engine(
//   'hbs',
//   engine({
//     layoutsDir: 'views/hbs/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
//   })
// );

// app.set('view engine', 'hbs');
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  res.status(404).render('404', {
    pageTitle: 'Page not found',
    layout: 'main-layout',
    path: '404'
  });
});

app.listen(3000);
