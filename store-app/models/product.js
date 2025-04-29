const getDb = require('../util/database_mongodb').getDb;

const PRODUCTS = 'products';

class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    const db = getDb();
    return db.collection(PRODUCTS).insertOne(this);
  }

  static fetchAll() {
    const db = getDb();
    return db.collection(PRODUCTS).find().toArray();
  }
}

module.exports = Product;
