const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  console.log('getAddProduct', req.user);
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

  const product = new Product(
    title,
    imageUrl,
    description,
    price,
    null,
    userId
  );

  product
    .save()
    .then(({ acknowledged, insertedId }) => {
      console.log(
        `Created: ${acknowledged} Create new document with id: ${insertedId}`
      );
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getAdminProducts = (req, res) => {
  Product.fetchAll()
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

  const product = new Product(title, imageUrl, description, price, productId);

  product
    .save()
    .then(({ acknowledged, modifiedCount }) => {
      console.log(
        `Updated: ${acknowledged}, modified ${modifiedCount} document.`
      );
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const {
    body: { productId }
  } = req;

  Product.deleteById(productId)
    .then(({ acknowledged, deletedCount }) => {
      console.log(
        `Deleted: ${acknowledged}, Deleted ${deletedCount} document.`
      );
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
