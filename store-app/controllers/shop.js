const Product = require('../models/product');

exports.getCart = (req, res) => {
  const { user } = req;
  user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        cart: products
      });
    })
    .catch((err) => console.log('error', err));
};

exports.postAddToCart = (req, res) => {
  const {
    body: { id },
    user
  } = req;

  let fetchedCart;
  let newQuantity = 1;

  user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id } });
    })
    .then((products) => {
      let product;
      if (products.length) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity += oldQuantity;
        return product;
      } else {
        return Product.findByPk(id);
      }
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.log('error', err));
};

exports.postDeleteItemFromCart = (req, res) => {
  const {
    body: { productId: id },
    user
  } = req;

  user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id } });
    })
    .then(([product]) => {
      return product.cartItem.destroy();
    })
    .then(() => {
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
