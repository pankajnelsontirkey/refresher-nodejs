const express = require('express');

const {
  deleteProduct,
  getAddProduct,
  getAdminProducts,
  getEditProduct,
  postAddProduct,
  postEditProduct
} = require('../controllers/admin');

const router = express.Router();

router.get('/products', getAdminProducts);

router.get('/add-product', getAddProduct);
router.post('/add-product', postAddProduct);

// router.get('/edit-product/:id', getEditProduct);
// router.post('/edit-product', postEditProduct);

// router.post('/delete-product', deleteProduct);

module.exports = { adminRoutes: router };
