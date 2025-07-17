const express = require('express');
const { check, body } = require('express-validator/');
const User = require('../models/user');

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
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email entered!')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password needs to be atleast 6 characters!')
      .isAlphanumeric()
      .withMessage('Only text and numbers are allowed!')
      .trim()
  ],
  postLogin
);

router.get('/signup', getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, {}) => {
        // if (value === 'test@test.com') {
        //   throw new Error(`Don't enter test emails`);
        // }
        // return true;
        return User.find({ email: value }).then((userDoc) => {
          if (userDoc?.length) {
            return Promise.reject('Email already existssss');
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Password can only have text and numbers, must be atleast 6 characters long.'
    )
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match!');
        }
        return true;
      })
  ],
  postSignup
);

router.post('/logout', postLogout);

router.get('/reset-password', getResetPassword);
router.post('/reset-password', postResetPassword);

router.get('/reset-password/:resetToken', getNewPassword);
router.post('/new-password', postNewPassword);

module.exports = { authRoutes: router };
