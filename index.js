const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection

mongoose.connect('mongodb://localhost:27017/cartapp')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

  
  


const cartSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, default: 1 },
});

const Cart = mongoose.model('Cart', cartSchema);

// Routes
app.get('/cart', async (req, res) => {
  const cartItems = await Cart.find();
  res.json(cartItems);
});

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

  

app.delete('/cart/remove/:name', async (req, res) => {
  const { name } = req.params;

  try {
    await Cart.deleteOne({ name });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(400).json({ error: 'Error removing item' });
  }
});

// Server Start
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
