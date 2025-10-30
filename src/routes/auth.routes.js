const express = require("express");
const { registerUserValidator, validate } = require("../middleware/validator.middleware");
const registerUser = require("../controllers/auth.controller");
const loginUser = require("../controllers/login.controller");

const router = express.Router();

router.post("/register", registerUserValidator, validate, registerUser);
router.post("/login", loginUser);

// Helpful GET handler so accidental GET requests (or browsers) receive
// a clear JSON response instead of Express' default HTML 'Cannot GET ...'
router.get('/login', (req, res) => {
	res.status(405).json({ message: 'Method Not Allowed. Use POST /api/auth/login with JSON body { username, password }' });
});

module.exports = router;