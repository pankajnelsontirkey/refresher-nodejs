const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  // username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    products: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product'
        },
        quantity: { type: Number, required: true }
      }
    ],
    totalPrice: Number
  }
});

userSchema.methods.addToCart = function (product) {
  const productExistsInCartIndex = this.cart.products.findIndex(
    (cartProduct) => cartProduct._id.toString() === product._id.toString()
  );

  let updatedCartProducts = [...this.cart.products];

  if (productExistsInCartIndex > -1) {
    updatedCartProducts[productExistsInCartIndex].quantity += 1;
  } else {
    updatedCartProducts.push({ _id: product._id, quantity: 1 });
  }

  const updatedCart = { products: updatedCartProducts };
  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updateProducts = this.cart.products.filter(
    (product) => product._id.toString() !== productId.toString()
  );
  this.cart.products = updateProducts;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { products: [], totalPrice: 0 };
  this.save();
};

module.exports = mongoose.model('User', userSchema);
