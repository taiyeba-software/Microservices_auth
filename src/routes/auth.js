const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// Simple register endpoint used for tests.
// Expects: { username, email, password, fullname: { firstname, lastname } }
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullname } = req.body;
    if (!username || !email || !password || !fullname || !fullname.firstname || !fullname.lastname) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const user = new User({ username, email, password, fullname });
    await user.save();
    // Return minimal user info
    return res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
