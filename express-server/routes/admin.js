const express = require('express');

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct
} = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', getAddProduct);
router.post('/add-product', postAddProduct);

router.get('/products', getProducts);

router.get('/edit-product/:id', getEditProduct);
router.post('/edit-product', postEditProduct);

router.post('/delete-product', deleteProduct);

module.exports = { adminRoutes: router };
