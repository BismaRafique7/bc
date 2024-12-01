const express = require('express');
const CartModel = require('../models/Cart');
const router = express.Router();

// Get all cart items
router.get('/', async (req, res) => {
  try {
    const cartItems = await CartModel.find();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  const { name, price, image, quantity } = req.body;

  try {
    let cartItem = await CartModel.findOne({ name });
    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = new CartModel({ name, price, image, quantity: quantity || 1 });
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Remove item from cart
router.delete('/remove/:name', async (req, res) => {
  const { name } = req.params;

  try {
    await CartModel.deleteOne({ name });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
