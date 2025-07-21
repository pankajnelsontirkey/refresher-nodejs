const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const {
    body: { title, imageUrl, description, price },
    user: { _id: userId }
  } = req;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      validationErrors: errors.array(),
      product: { title, imageUrl, description, price },
      errorMessage: errors.array()[0].msg
    });
  }

  const product = new Product({
    title,
    imageUrl,
    description,
    price,
    userId
  });

  product
    .save()
    .then((result) => {
      console.log(`${result._id}`);
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   validationErrors: [],
      //   product: { title, imageUrl, description, price },
      //   errorMessage: 'Database operation failed, please try again!'
      // });
      // // res.redirect('/500');
      // throw new Error();
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAdminProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    // .populate('userId', 'username')
    .then((products) => {
      res.render('admin/view-products', {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        products
      });
    })
    .catch((err) => {
      console.log('error while fetching products from database', err);
      res.render('admin/view-products', {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        products: []
      });
    });
};

exports.getEditProduct = (req, res) => {
  const {
    params: { id },
    query: { edit }
  } = req;

  Product.findById(id)
    .then((product) => {
      if (!product) {
        throw 'Product not found';
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
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

exports.postEditProduct = (req, res) => {
  const {
    body: { title, imageUrl, description, price, productId }
  } = req;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: `/admin/edit-product`,
      editing: true,
      hasError: true,
      validationErrors: errors.array(),
      product: { title, imageUrl, description, price, _id: productId },
      errorMessage: errors.array()[0].msg
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save().then((result) => {
        console.log('Product updated');
        res.redirect('/admin/products');
      });
    })
    .catch((err) => {
      console.log('err', err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res) => {
  const {
    body: { productId }
  } = req;

  // Product.findByIdAndDelete(productId)
  //   .then((result) => {
  //     res.redirect('/admin/products');
  //   })
  //   .catch((err) => console.log(err));

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then((result) => {
      console.log('Product deleted');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
