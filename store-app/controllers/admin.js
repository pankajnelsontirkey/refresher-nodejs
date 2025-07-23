const { validationResult } = require('express-validator');

const Product = require('../models/product');
const { deleteFile } = require('../util/files');

exports.getAddProduct = (req, res) => {
  res.render('manage/edit-product', {
    pageTitle: 'Add Product',
    path: '/manage/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const {
    body: { title, description, price },
    user: { _id: userId },
    file: image
  } = req;

  if (!image) {
    return res.status(422).render('manage/edit-product', {
      pageTitle: 'Add Product',
      path: '/manage/add-product',
      editing: false,
      hasError: true,
      validationErrors: [],
      product: { title, description, price },
      errorMessage: 'Attached file is not a valid image!'
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('manage/edit-product', {
      pageTitle: 'Add Product',
      path: '/manage/add-product',
      editing: false,
      hasError: true,
      validationErrors: errors.array(),
      product: { title, description, price },
      errorMessage: errors.array()[0].msg
    });
  }

  const product = new Product({
    title,
    imageUrl: image.path,
    description,
    price,
    userId
  });

  product
    .save()
    .then((result) => {
      console.log(`${result._id}`);
      res.redirect('/manage/products');
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAdminProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    // .populate('userId', 'username')
    .then((products) => {
      res.render('manage/view-products', {
        pageTitle: 'Admin Products',
        path: '/manage/products',
        products
      });
    })
    .catch((err) => {
      console.log('error while fetching products from database', err);
      res.render('manage/view-products', {
        pageTitle: 'Admin Products',
        path: '/manage/products',
        products: []
      });
    });
};

exports.getEditProduct = (req, res, next) => {
  const {
    params: { id },
    query: { edit }
  } = req;

  Product.findById(id)
    .then((product) => {
      if (!product) {
        throw 'Product not found';
      }
      res.render('manage/edit-product', {
        pageTitle: 'Edit Product',
        path: '/manage/edit-product',
        editing: edit === 'true',
        product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const {
    body: { title, description, price, productId },
    file: image
  } = req;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('manage/edit-product', {
      pageTitle: 'Add Product',
      path: `/manage/edit-product`,
      editing: true,
      hasError: true,
      validationErrors: errors.array(),
      product: { title, description, price, _id: productId },
      errorMessage: errors.array()[0].msg
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      if (image) {
        deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.description = description;
      product.price = price;
      return product.save().then((result) => {
        console.log('Product updated');
        res.redirect('/manage/products');
      });
    })
    .catch((err) => {
      console.log('err', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const {
    body: { productId }
  } = req;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error('Product not found!'));
      }
      deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then((result) => {
      console.log('Product deleted');
      res.redirect('/manage/products');
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
