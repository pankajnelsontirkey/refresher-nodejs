const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const { Cart } = require('./cart');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
  fs.readFile(p, 'utf-8', (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          if (err) {
            console.log('err', err);
          }
        });
      } else {
        this.id = parseInt(Math.random() * 10000).toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) {
            console.log('err', err);
          }
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      const updatedProducts = products.filter((product) => product.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      cb(product);
    });
  }
}

module.exports = { Product };
