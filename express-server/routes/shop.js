const express = require('express');

const { getProducts } = require('../controllers/products');
const { getCart, getCheckout } = require('../controllers/shop');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('shop/index', { pageTitle: 'Home', path: '/' });
});

router.get('/products', getProducts);

router.get('/cart', getCart);

router.get('/checkout', getCheckout);

module.exports = { shopRoutes: router };
