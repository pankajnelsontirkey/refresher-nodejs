const { Cart } = require('../models/cart');
const { Product } = require('../models/product');

exports.getCart = (req, res) => {
  const cartData = { products: [], totalPrice: 0 };
  const cartProducts = [];
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      cart.products.forEach((cartProduct) => {
        products.forEach((product) => {
          if (product.id === cartProduct.id) {
            cartData.products.push({
              ...product,
              quantity: cartProduct.quantity
            });
            cartData.totalPrice += product.price * cartProduct.quantity;
          }
        });
      });

      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        cart: cartData
      });
    });
  });
};

exports.postCart = (req, res) => {
  const {
    body: { id }
  } = req;

  Product.findById(id, (product) => {
    Cart.addProduct(id, product.price);
  });

  res.redirect('/cart');
};

exports.postDeleteItemFromCart = (req, res) => {
  const {
    body: { productId: id }
  } = req;

  Product.findById(id, (product) => {
    Cart.deleteProduct(id, product.price);
    res.redirect('/cart');
  });
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', { pageTitle: 'Your Orders', path: '/orders' });
};

exports.getProductById = (req, res) => {
  const {
    params: { id }
  } = req;

  Product.findById(id, (product) => {
    return res.render('shop/product-details', {
      pageTitle: 'Product Details',
      path: `/products/${id}`,
      product
    });
  });
};
