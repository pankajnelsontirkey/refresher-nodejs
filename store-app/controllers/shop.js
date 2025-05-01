const Product = require('../models/product');
const Order = require('../models/order');

exports.getShopProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        pageTitle: 'Products',
        path: '/products',
        products
      });
    })
    .catch((err) => {
      console.log('Error while fetching from database', err);
      res.render('shop/product-list', {
        pageTitle: 'Products',
        path: '/products',
        products: []
      });
    });
};

exports.getProductById = (req, res) => {
  const {
    params: { id }
  } = req;

  Product.findById(id)
    .then((product) => {
      res.render('shop/product-details', {
        pageTitle: product.title,
        product: product,
        path: `/products/${id}`
      });
    })
    .catch((err) => {
      console.log(err);
      res.render('shop/product-details', {
        pageTitle: 'Product Details',
        path: `/products/${id}`,
        product: null
      });
    });
};

exports.getCart = (req, res) => {
  const { user } = req;

  user
    .populate('cart.products.productId')
    .then((user) => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        cart: { ...user.cart }
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddToCart = (req, res) => {
  const {
    body: { productId },
    user
  } = req;

  Product.findById(productId)
    .then((product) => {
      return user.addToCart(product);
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteItemFromCart = (req, res) => {
  const {
    body: { productId },
    user
  } = req;

  user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postCreateOrder = (req, res) => {
  const { user } = req;

  user
    .populate('cart.products.productId')
    .then((userData) => {
      const products = userData.cart.products.map(
        ({ productId, quantity }) => ({ quantity, productId })
      );

      const totalPrice = userData.cart.products.reduce(
        (total, { productId, quantity }) => {
          return total + productId.price * quantity;
        },
        0
      );

      const order = new Order({
        user: { username: userData.username, userId: userData._id },
        products,
        totalPrice
      });

      return order.save();
    })
    .then((result) => {
      return user.clearCart();
    })
    .then((result) => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  const { user } = req;

  Order.find({ 'user.userId': user._id })
    .populate('products.productId')
    .then((orders) => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders
      });
    })
    .catch((err) => console.log('getOrders', err));
};
