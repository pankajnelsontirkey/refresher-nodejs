const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const { sendMail } = require('../util/mailer');
const { BASE_URL, PORT } = require('../util/constants');

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
    errorMessage,
    prevInput: { email: '', password: '' },
    validationErrors: []
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      prevInput: { email, password },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password!',
          prevInput: { email, password },
          validationErrors: []
        });
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
          // res.redirect('/login');
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password!',
            prevInput: { email, password },
            validationErrors: []
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch((err) => {
      console.log('postLogin catch() ', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    errorMessage,
    prevInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: []
  });
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      prevInput: { email, password, confirmPassword },
      validationErrors: errors.array()
    });
  }

  // User.findOne({ email })
  //   .then((userDoc) => {
  //     if (userDoc) {
  //       req.flash('error', 'Email already exists!');
  //       return res.redirect('/signup');
  //     } else {
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

      const mailOptions = {
        to: email,
        subject: 'Signup successful!',
        html: `<h1>Signup Success</h1><p1>Registration successful for user with email ${email}`
      };
      sendMail(mailOptions).catch((err) => console.error(err));
    })
    .catch((err) => {
      console.error(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // }
  // })
  // .catch((err) => console.error(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getResetPassword = (req, res) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render('auth/reset-password', {
    path: '/reset-password',
    pageTitle: 'Reset Password',
    errorMessage
  });
};

exports.postResetPassword = (req, res) => {
  const { email } = req.body;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset-password');
    }

    const token = buffer.toString('hex');

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'Email not found!');
          return res.redirect('/reset-password');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 1 * 60 * 60 * 1000;
        return user.save();
      })
      .then((result) => {
        res.redirect('/');

        const mailOptions = {
          to: email,
          subject: 'Password Reset',
          html: `<p>You requested a password reset</p>
          <p>Follow the <a href=${BASE_URL}:${PORT}/reset-password/${token}>link</a> to set a new password.</p>`
        };
        sendMail(mailOptions).catch((err) => console.error(err));
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res) => {
  const { resetToken } = req.params;

  User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let errorMessage = req.flash('error');
      if (errorMessage.length) {
        errorMessage = errorMessage[0];
      } else {
        errorMessage = null;
      }

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage,
        userId: user._id.toString(),
        passwordToken: resetToken
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res) => {
  const { password, passwordToken, userId } = req.body;

  let resetUser = null;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      return res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
