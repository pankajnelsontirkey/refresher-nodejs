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
    body: { title, imageUrl, description, price }
  } = req;

  const product = new Product(title, imageUrl, description, price);
  product
    .save()
    .then(({ insertedId }) => {
      console.log(insertedId);
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

/* exports.getEditProduct = (req, res) => {
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
}; */

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
