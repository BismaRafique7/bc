const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Associate with a user
  items: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const CartModel = mongoose.model('cart', CartSchema);

module.exports = CartModel;
