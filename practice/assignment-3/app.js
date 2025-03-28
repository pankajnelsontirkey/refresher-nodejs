const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const rootRouter = require('./routes/home');
const usersRouter = require('./routes/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(usersRouter);
app.use(rootRouter);

app.listen(3000);
