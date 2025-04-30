const { ObjectId } = require('mongodb');
const { PRODUCTS } = require('../util/constants').COLLECTIONS;

const getDb = require('../util/database_mongodb').getDb;

class Product {
  constructor(title, imageUrl, description, price, id, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? ObjectId.createFromHexString(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection(PRODUCTS)
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection(PRODUCTS).insertOne(this);
    }
    return dbOp;
  }

  static fetchAll() {
    const db = getDb();
    return db.collection(PRODUCTS).find().toArray();
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection(PRODUCTS)
      .findOne({ _id: ObjectId.createFromHexString(id) });
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection(PRODUCTS)
      .deleteOne({ _id: ObjectId.createFromHexString(id) });
  }
}

module.exports = Product;
