const express = require('express');

const {
  getCart,
  getCheckout,
  getOrders,
  getProductById,
  postCart,
  postDeleteItemFromCart,
  getShopProducts
} = require('../controllers/shop');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('shop/index', { pageTitle: 'Home', path: '/' });
});

router.get('/products', getShopProducts);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.post('/cart-delete-item', postDeleteItemFromCart);

router.get('/checkout', getCheckout);

router.get('/orders', getOrders);

router.get('/products/:id', getProductById);

module.exports = { shopRoutes: router };
