const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection


mongoose.connect('mongodb://localhost:27017/orderapp')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

  

// Order Schema
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

// Routes

// Handle Checkout (Place Order)
app.post('/checkout', async (req, res) => {
  try {
    const { email, firstName, lastName, address, city, postalCode, shippingMethod, total, cartItems } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !address || !city || !postalCode || !shippingMethod || !total || !cartItems.length) {
      return res.status(400).json({ error: 'Invalid or missing data' });
    }

    // Create and save a new order
    const newOrder = new Order({
      email,
      firstName,
      lastName,
      address,
      city,
      postalCode,
      shippingMethod,
      total,
      cartItems,
    });

    await newOrder.save();

    // Respond with the saved order
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Server error while placing order' });
  }
});

// Cancel Order (Delete Order by ID)
app.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the order by its ID
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order cancelled successfully', order: deletedOrder });
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ error: 'Server error while cancelling order' });
  }
});

// Fetch All Orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find(); // Retrieve all orders from the database
    res.status(200).json({ orders }); // Respond with the list of orders
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Server error while fetching orders' });
  }
});

// Start Server
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
