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
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/products');
});

router.get('/products', getShopProducts);
router.get('/products/:id', getProductById);

router.use('/cart', isAuthenticated);
router.post('/cart', postAddToCart);
router.get('/cart', getCart);
router.post('/cart-delete-item', postDeleteItemFromCart);

router.use('/orders', isAuthenticated);
router.post('/create-order', postCreateOrder);
router.get('/orders', getOrders);

module.exports = { shopRoutes: router };
