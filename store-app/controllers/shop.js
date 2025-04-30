const Product = require('../models/product');

exports.getShopProducts = (req, res) => {
  Product.fetchAll()
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

  const quantities = {};
  user.cart.products.forEach((product) => {
    quantities[product.productId.toString()] = product.quantity;
  });

  user
    .getCart()
    .then((products) => {
      return products.map((product) => {
        return {
          ...product,
          quantity: quantities[product._id.toString()]
        };
      });
    })
    .then((productsWithQuantity) => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        cart: { ...user.cart, products: productsWithQuantity }
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
    .then(({ acknowledge, modifiedCount }) => {
      console.log(`Updated - ${acknowledge}; count:  ${modifiedCount}`);
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
    .deleteFromCart(productId)
    .then(({ result }) => {
      console.log(`${result}`);
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postCreateOrder = (req, res) => {
  const { user } = req;
  let fetchedCart;

  user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .then((result) => {
          return fetchedCart.setProducts(null);
          res.redirect('/orders');
        })
        .then((result) => {
          res.redirect('/orders');
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  const { user } = req;

  user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      console.log(orders);
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders
      });
    })
    .catch((err) => console.log(err));
};
