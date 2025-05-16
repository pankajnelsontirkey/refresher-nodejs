const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  const {
    body: { title, imageUrl, description, price },
    user: { _id: userId }
  } = req;

  const product = new Product({ title, imageUrl, description, price, userId });

  product
    .save()
    .then((result) => {
      console.log(`${result._id}`);
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getAdminProducts = (req, res) => {
  Product.find()
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
        product
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const {
    body: { title, imageUrl, description, price, productId }
  } = req;

  Product.findByIdAndUpdate(productId, { title, imageUrl, description, price })
    .then((result) => {
      // console.log(`${result}`);
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const {
    body: { productId }
  } = req;

  Product.findByIdAndDelete(productId)
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
