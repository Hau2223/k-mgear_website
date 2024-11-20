const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  idUser: {
    type: String,
    required: true,
    ref: 'User',
  },
  idProduct: {
    type: String,
    required: true,
    ref: 'Product',
  },
  datetime: {
    type: Date,
    default: Date.now()
  },
  amount: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    required: true,
  }
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
