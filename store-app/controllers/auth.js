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

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
