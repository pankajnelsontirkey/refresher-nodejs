const express = require('express');

const {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  postLogout,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword
} = require('../controllers/auth');

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);

router.get('/signup', getSignup);
router.post('/signup', postSignup);

router.post('/logout', postLogout);

router.get('/reset-password', getResetPassword);
router.post('/reset-password', postResetPassword);

router.get('/reset-password/:resetToken', getNewPassword);
router.post('/new-password', postNewPassword);

module.exports = { authRoutes: router };
