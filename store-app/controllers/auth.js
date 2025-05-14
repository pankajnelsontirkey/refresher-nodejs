const bcrypt = require('bcryptjs');

const User = require('../models/user');

const { DUMMY_USER_OBJECTID } = process.env;

exports.getLogin = (req, res) => {
  res.render('auth/login', { path: '/login', isAuthenticated: req.isLoggedIn });
};

exports.postLogin = (req, res) => {
  User.findById(DUMMY_USER_OBJECTID)
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect('/signup');
      } else {
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            if (hashedPassword) {
              const user = new User({
                email,
                password: hashedPassword,
                cart: { items: [] }
              });
              return user.save();
            }
          })
          .then((result) => {
            res.redirect('/login');
          })
          .catch((err) => console.error(err));
      }
    })
    .catch((err) => console.error(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
