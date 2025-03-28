const express = require('express');

const router = express.Router();

const users = [];

router.get('/', (req, res) => {
  res.render('users', { users, pageTitle: 'Users' });
});

router.post('/', (req, res) => {
  const {
    body: { username }
  } = req;
  if (username) {
    users.push(username);
  }
  res.redirect('/users');
});

module.exports = { userRoutes: router };
