const { Product } = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
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

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/view-products', {
      pageTitle: 'Admin Products',
      path: '/products',
      products
    });
  });
};
