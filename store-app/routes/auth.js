const express = require('express');

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup
} = require('../controllers/auth');

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);

router.get('/signup', getSignup);
router.post('/signup', postSignup);

router.post('/logout', postLogout);

module.exports = { authRoutes: router };
