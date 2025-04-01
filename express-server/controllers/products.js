const { Product } = require('../models/product');

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      pageTitle: 'Products',
      path: '/products',
      products
    });
  });
};
