const express = require('express');

const {
  getCart,
  getOrders,
  getProductById,
  postDeleteItemFromCart,
  getShopProducts,
  postAddToCart,
  postCreateOrder
} = require('../controllers/shop');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/products');
});

router.get('/products', getShopProducts);

router.post('/cart', postAddToCart);
router.get('/cart', getCart);
router.post('/cart-delete-item', postDeleteItemFromCart);

router.post('/create-order', postCreateOrder);
router.get('/orders', getOrders);

router.get('/products/:id', getProductById);

module.exports = { shopRoutes: router };
