const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', { pageTitle: 'Add User' });
});

module.exports = { homeRoutes: router };
