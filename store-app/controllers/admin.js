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
    body: { title, imageUrl, price, description },
    user
  } = req;
  console.log(user);

  user
    .createProduct({ title, imageUrl, price, description })
    .then(({ dataValues }) => {
      console.log('Product created with id: ', dataValues.id);
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log('err', err);
    });
};

exports.getEditProduct = (req, res) => {
  const {
    params: { id },
    query: { edit },
    user
  } = req;

  user
    .getProducts({ where: { id } })
    // Product.findByPk(id)
    .then(([product]) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: edit === 'true',
        product
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

  Product.findByPk(productId)
    .then((product) => {
      product.set({ title, imageUrl, description, price });
      return product.save();
    })
    .then((result) => {
      console.log('Product was updated');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log('error while updating', err);
    });
};

exports.getAdminProducts = (req, res) => {
  const { user } = req;

  user
    // Product.fetchAll()
    // Product.findAll()
    .getProducts()
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

exports.deleteProduct = (req, res) => {
  const {
    body: { productId: id }
  } = req;
  // Product.destroy(id);
  Product.findByPk(id)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      console.log('Product was deleted!');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log('Error while deletin product', err);
    });
};
