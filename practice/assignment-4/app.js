const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const { homeRoutes } = require('./routes/home');
const { userRoutes } = require('./routes/users');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', userRoutes);
app.use('/', homeRoutes);

app.listen(3000);
