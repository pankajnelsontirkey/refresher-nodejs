const products = [];

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  });
};

exports.postAddProduct = (req, res) => {
  const {
    body: { title }
  } = req;
  products.push({ title: title });
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  res.render('shop', { pageTitle: 'Shop', path: '/', products });
};
