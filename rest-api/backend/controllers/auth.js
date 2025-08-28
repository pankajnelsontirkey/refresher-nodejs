const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { JWT_SECRET } = require('../utils/constants');

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { email, name, password } = req.body;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({ email, password: hashedPassword, name });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: 'User created', userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  let currentUser;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error('Email not found!');
        error.statusCode = 401;
        throw error;
      }
      currentUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Password is incorrect!');
        error.statusCode = 401;
        throw error;
      }

      const { email, _id } = currentUser;
      const userId = _id.toString();

      const token = jwt.sign({ email, userId }, `${JWT_SECRET}`, {
        expiresIn: '1h'
      });
      res.status(200).json({ token, userId });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = { signup, login };
