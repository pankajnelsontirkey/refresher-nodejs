const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'user with email not found!');
        return res.redirect('/login');
      }

      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save((err) => {
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch((err) => console.log('postLogin catch() ', err));
};

exports.getSignup = (req, res) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage
  });
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password) {
    req.flash('error', 'email/password is required!');
    return res.redirect('/signup');
  }

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'Email already exists!');
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
