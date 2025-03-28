const path = require('path');
const express = require('express');

// const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  });
});

router.post('/add-product', (req, res) => {
  const { body } = req;
  console.log('body', body);
  products.push({ title: body?.title });
  res.redirect('/');
});

module.exports = { router, products };
