// Order Schema
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    shippingMethod: { type: String, required: true },
    total: { type: Number, required: true },
    cartItems: [
      {
        name: { type: String, required: true },
        price: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  });
  
  const Order = mongoose.model('Order', orderSchema);
  module.exports = Order;