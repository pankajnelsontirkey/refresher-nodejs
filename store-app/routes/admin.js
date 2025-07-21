const express = require('express');
const { body } = require('express-validator');

const {
  deleteProduct,
  getAddProduct,
  getAdminProducts,
  getEditProduct,
  postAddProduct,
  postEditProduct
} = require('../controllers/admin');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

router.use(isAuthenticated);

router.get('/products', getAdminProducts);

router.get('/add-product', getAddProduct);
router.post(
  '/add-product',
  [
    body('title')
      .isAlphanumeric('en-US', { ignore: ' -' })
      .withMessage('Title can only have letters & numbers!')
      .isLength({ min: 3 })
      .withMessage('Title should be atleats 3 characters!')
      .trim(),
    // body('imageUrl').isURL().withMessage('Image URL needs to be a valid URL!'),
    body('price')
      .isDecimal({ decimal_digits: '2' })
      .withMessage('Price is required!'),
    body('description')
      .isAlphanumeric('en-US', { ignore: ' -' })
      .withMessage('Description can only have letters & numbers!')
      .isLength({ min: 5, max: '500' })
      .withMessage('Description should be between 5-500 characters!')
      .trim()
  ],
  postAddProduct
);

router.get('/edit-product/:id', getEditProduct);
router.post(
  '/edit-product',
  [
    body('title')
      .isAlphanumeric('en-US', { ignore: ' -' })
      .withMessage('Title can only have letters & numbers!')
      .isLength({ min: 3 })
      .withMessage('Title should be atleats 3 characters!')
      .trim(),
    // body('imageUrl').isURL().withMessage('Image URL needs to be a valid URL!'),
    body('price')
      .isDecimal({ decimal_digits: '2' })
      .withMessage('Price is required!'),
    body('description')
      .isAlphanumeric('en-US', { ignore: ' -' })
      .withMessage('Description can only have letters & numbers!')
      .isLength({ min: 5, max: '500' })
      .withMessage('Description should be between 5-500 characters!')
      .trim()
  ],
  postEditProduct
);

router.post('/delete-product', deleteProduct);

module.exports = { adminRoutes: router };
