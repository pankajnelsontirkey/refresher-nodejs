const { Product } = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  });
};

exports.postAddProduct = (req, res) => {
  const {
    body: { title }
  } = req;
  const product = new Product(title);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop', { pageTitle: 'Shop', path: '/', products });
  });
};
