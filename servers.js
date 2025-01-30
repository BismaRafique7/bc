const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const UserModel = require('./models/User');
const app = express();
const Order =require('./models/order')
const Cart =require('./models/cart')
// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection (single connection for all databases)
mongoose.connect('mongodb://localhost:27017/cartapp')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Cart Schema
//const cartSchema = new mongoose.Schema({
  //name: { type: String, required: true },
  //price: { type: String, required: true },
  //image: { type: String, required: true },
  //quantity: { type: Number, default: 1 },
//});

//const Cart = mongoose.model('Cart', cartSchema);

// Order Schema
//const orderSchema = new mongoose.Schema({
  //email: { type: String, required: true },
  //firstName: { type: String, required: true },
  //lastName: { type: String, required: true },
  //address: { type: String, required: true },
  //city: { type: String, required: true },
  //postalCode: { type: String, required: true },
  //shippingMethod: { type: String, required: true },
  //total: { type: Number, required: true },
  //cartItems: [
    //{
   //   name: { type: String, required: true },
     // price: { type: String, required: true },
      //quantity: { type: Number, required: true },
    //},
  //],
//});

//const Order = mongoose.model('Order', orderSchema);

// Routes for Cart

// Get all cart items
app.get('/cart', async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve cart items' });
  }
});

// Add item to cart
app.post('/cart/add', async (req, res) => {
  try {
    const { name, price, image, quantity } = req.body;
    if (!name || !price || !image) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    let cartItem = await Cart.findOne({ name });
    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = new Cart({ name, price, image, quantity: quantity || 1 });
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item from cart
app.delete('/cart/remove/:name', async (req, res) => {
  const { name } = req.params;
  try {
    await Cart.deleteOne({ name });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(400).json({ error: 'Error removing item' });
  }
});

// Routes for User Authentication

// Register new user
app.post('/add', (req, res) => {
  const { email, password } = req.body;
  UserModel.create({ email, password })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email, password })
    .then((user) => {
      if (user) {
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.json({ success: false, message: 'Invalid email or password' });
      }
    })
    .catch((err) => res.json(err));
});

// Reset password
app.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  UserModel.findOneAndUpdate({ email }, { password: newPassword }, { new: true })
    .then((user) => {
      if (user) {
        res.json({ success: true, message: 'Password updated successfully' });
      } else {
        res.json({ success: false, message: 'Email not found' });
      }
    })
    .catch((err) => res.json(err));
});

// Routes for Order Management

// Handle Checkout (Place Order)
app.post('/checkout', async (req, res) => {
  try {
    const { email, firstName, lastName, address, city, postalCode, shippingMethod, total, cartItems } = req.body;

    if (!email || !firstName || !lastName || !address || !city || !postalCode || !shippingMethod || !total || !cartItems.length) {
      return res.status(400).json({ error: 'Invalid or missing data' });
    }

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
    const orders = await Order.find();
    res.status(200).json({ orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Server error while fetching orders' });
  }
});

// Start Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
