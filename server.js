const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Get all users (for testing purposes)
app.get('/get', (req, res) => {
  UserModel.find()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

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

// MongoDB connection
mongoose
  .connect('mongodb://127.0.0.1:27017/userapp')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Server listening
app.listen(3002, () => {
  console.log('Backend server running on port 3001');
});

app.get('/', (req, res) => {
  res.send('Backend server is running');
});
