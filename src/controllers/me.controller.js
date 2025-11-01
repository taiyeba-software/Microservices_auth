const User = require("../models/user.model");

const getCurrentUser = async (req, res) => {
  try {
    // User is already fetched and attached by auth middleware
    // Just format the response according to test expectations
    return res.status(200).json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role || 'user',
        fullname: req.user.fullname,
        address: req.user.address || []
      }
    });
  } catch (err) {
    console.error("❌ Get Me Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = getCurrentUser;
