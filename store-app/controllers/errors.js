const isAuthenticated = require('../middleware/isAuthenticated');

exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page not found',
    layout: 'main-layout',
    path: '404',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    layout: 'main-layout',
    path: '500',
    isAuthenticated: req.session.isLoggedIn
  });
};
