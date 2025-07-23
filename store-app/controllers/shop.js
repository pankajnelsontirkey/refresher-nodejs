const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

exports.getShopProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        pageTitle: 'Products',
        path: '/',
        products
      });
    })
    .catch((err) => {
      console.log('Error while fetching from database', err);
      res.render('shop/product-list', {
        pageTitle: 'Products',
        path: '/',
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
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
        user: { email: userData.email, userId: userData._id },
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
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const {
    params: { orderId },
    user
  } = req;

  Order.findById(orderId)
    .populate({
      path: 'products.productId',
      select: ['title', 'price']
    })
    .then((order) => {
      if (!order) {
        return next(new Error('Order not found!'));
      }

      if (order.user.userId.toString() !== user._id.toString()) {
        return next(new Error('User not authorized to view this order!'));
      }
      const invoiceName = `invoice_${orderId}.pdf`;
      const invoicePath = path.join('data', 'invoices', invoiceName);

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
      //   res.send(data);
      // });

      // const file = fs.createReadStream(invoicePath);
      // file.pipe(res);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice');
      pdfDoc.text('---------');

      let totalPrice = 0;
      order.products.forEach((product) => {
        pdfDoc
          .fontSize(18)
          .text(
            `${product.productId.title} - ${product.quantity} x $${product.productId.price}`
          );
        totalPrice += product.quantity * product.productId.price;
      });

      pdfDoc.fontSize(18).text('---------');
      pdfDoc.fontSize(22).text(`Total Price: $${totalPrice}`);

      pdfDoc.end();
    })
    .catch((err) => {
      return next(err);
    });
};
