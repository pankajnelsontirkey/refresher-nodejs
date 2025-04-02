const express = require('express');

const { getProducts } = require('../controllers/products');
const { getCart, getCheckout, getOrders } = require('../controllers/shop');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('shop/index', { pageTitle: 'Home', path: '/' });
});

router.get('/products', getProducts);

router.get('/cart', getCart);

router.get('/checkout', getCheckout);

router.get('/orders', getOrders);

module.exports = { shopRoutes: router };
