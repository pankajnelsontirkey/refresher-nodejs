const express = require('express');
const { body } = require('express-validator');

const { signup } = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) =>
        User.find({ email: value }).then((doc) => {
          if (doc) {
            return Promise.reject('Email already exists!');
          }
        })
      )
      .normalizeEmail(),
    body('password').trim().isLength({ min: 6 }),
    body('name').trim().not().isEmpty()
  ],
  signup
);

module.exports = router;
