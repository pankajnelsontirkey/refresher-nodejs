const { Product } = require('../models/product');

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(([rows]) => {
      const products = rows;

      res.render('shop/product-list', {
        pageTitle: 'Products',
        path: '/products',
        products
      });
    })
    .catch((err) => {
      console.log('Error while fetching from database', err);
      res.render('shop/product-list', {
        pageTitle: 'Products',
        path: '/products',
        products: []
      });
    });
};
