const { PRODUCTS, USERS } = require('../util/constants').COLLECTIONS;
const { getDb } = require('../util/database_mongodb');

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id ? id : null;
  }

  save() {
    const db = getDb();
    return db.collection(USERS).insertOne(this);
  }

  addToCart(product) {
    const productExistsInCartIndex = this.cart.products.findIndex(
      (cartProduct) =>
        cartProduct.productId.toString() === product._id.toString()
    );

    let updatedCartProducts = [...this.cart.products];

    if (productExistsInCartIndex > -1) {
      console.log('increment product');
      updatedCartProducts[productExistsInCartIndex].quantity += 1;
    } else {
      console.log('new products');
      updatedCartProducts.push({ productId: product._id, quantity: 1 });
    }

    const updatedCart = { products: updatedCartProducts };

    const db = getDb();
    return db
      .collection(USERS)
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.products.map((product) => product.productId);
    return db
      .collection(PRODUCTS)
      .find({ _id: { $in: productIds } })
      .toArray();
  }

  deleteFromCart(productId) {
    const updateProducts = this.cart.products.filter(
      (product) => product.productId.toString() !== productId.toString()
    );
    const db = getDb();
    return db
      .collection(USERS)
      .updateOne(
        { _id: this._id },
        { $set: { cart: { ...this.cart, products: updateProducts } } }
      );
  }

  static findById(userId) {
    const db = getDb();
    return db.collection(USERS).findOne({ _id: userId });
  }
}

module.exports = User;
