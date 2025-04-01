exports.getCart = (req, res) => {
  res.render('shop/cart', { pageTitle: 'Your Cart', path: '/cart' });
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
};
