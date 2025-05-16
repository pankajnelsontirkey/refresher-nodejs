const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      quantity: { type: Number, rquired: true }
    }
  ],
  user: {
    email: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
  },
  totalPrice: { type: Number, required: true }
});

module.exports = mongoose.model('Order', orderSchema);
