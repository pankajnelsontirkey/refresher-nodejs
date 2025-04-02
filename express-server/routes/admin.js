const express = require('express');

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct
} = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', getAddProduct);

router.post('/add-product', postAddProduct);

router.get('/products', getProducts);

router.get('/edit-product', getEditProduct);

router.delete('/delete-product', (req, res) => {
  console.log('delete the product');
});

module.exports = { adminRoutes: router };
