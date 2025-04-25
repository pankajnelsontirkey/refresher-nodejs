const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json');

class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, 'utf-8', (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err && fileContent !== '') {
        cart = { ...cart, ...JSON.parse(fileContent) };
      }

      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );

      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct;

      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + productPrice;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log('error while saving cart to file', err);
        }
      });
    });
  }

  static deleteProduct(id, price) {
    fs.readFile(p, 'utf-8', (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((product) => product.id === id);

      if (!product) {
        return;
      }

      const quantity = product.quantity;
      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      );
      updatedCart.totalPrice -= price * quantity;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.log('error while saving cart to file', err);
        }
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, 'utf-8', (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (err) {
        return cb(null);
      }
      if (!err && fileContent !== '') {
        cart = { ...cart, ...JSON.parse(fileContent) };
      }
      cb(cart);
    });
  }
}

module.exports = { Cart };
