const { Product } = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  const {
    body: { title, imageUrl, price, description }
  } = req;

  const newProduct = new Product(
    null,
    title,
    imageUrl,
    description,
    parseFloat(price)
  );
  newProduct
    .save()
    .then(() => {
      res.redirect('/products');
    })
    .catch((err) => {
      console.log('error while adding product', err);
      res.redirect('/admin/add-product');
    });
};

exports.getEditProduct = (req, res) => {
  const {
    params: { id },
    query: { edit }
  } = req;

  Product.findById(id)
    .then(([row]) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: edit === 'true',
        product: row
      });
    })
    .catch((err) => {
      console.log(err);
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: edit === 'true',
        product: null
      });
    });
};

exports.postEditProduct = (req, res) => {
  const {
    body: { productId, title, imageUrl, description, price }
  } = req;

  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  );

  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render('admin/view-products', {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        products: rows
      });
    })
    .catch((err) => {
      console.log('error while fetching products from database');
      res.render('admin/view-products', {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        products: []
      });
    });
};

exports.deleteProduct = (req, res) => {
  const {
    body: { productId: id }
  } = req;
  Product.deleteById(id);
  res.redirect('/admin/products');
};
