const express = require('express');
const UserModel = require('../models/User');
const router = express.Router();

// Register user
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  UserModel.create({ email, password })
    .then((user) => res.status(201).json(user))
    .catch((err) => res.status(400).json(err));
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email, password })
    .then((user) => {
      if (user) {
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
