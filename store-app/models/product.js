const { Cart } = require('./cart');

const db = require('../util/database');
const TABLE = 'products';

class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    const { title, price, imageUrl, description } = this;
    return db.execute(
      `INSERT INTO ${TABLE} (title, price, imageUrl, description) VALUES (?,?,?,?)`,
      [title, price, imageUrl, description]
    );
  }

  static deleteById(id) {}

  static fetchAll() {
    return db.execute(`SELECT * FROM ${TABLE}`);
  }

  static findById(id) {
    return db.execute(`SELECT * FROM ${TABLE} WHERE ${TABLE}.id = ?`, [id]);
  }
}

module.exports = { Product };
