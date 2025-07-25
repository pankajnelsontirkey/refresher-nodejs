const express = require('express');

const {
  getCart,
  getOrders,
  getProductById,
  postDeleteItemFromCart,
  getShopProducts,
  postAddToCart,
  postCreateOrder,
  getInvoice,
  getCheckout
} = require('../controllers/shop');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

router.get('/', getShopProducts);
router.get('/products/:id', getProductById);

router.use('/cart', isAuthenticated);
router.post('/cart', postAddToCart);
router.get('/cart', getCart);
router.post('/cart-delete-item', postDeleteItemFromCart);

router.use('/checkout', isAuthenticated);
router.get('/checkout', getCheckout);

router.use('/orders', isAuthenticated);
router.post('/create-order', postCreateOrder);
router.get('/orders', getOrders);
router.get('/orders/:orderId', isAuthenticated, getInvoice);

module.exports = { shopRoutes: router };
