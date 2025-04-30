const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    products: [
      {
        productId: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    totalPrice: Number
  }
});

module.exports = mongoose.model('User', userSchema);
