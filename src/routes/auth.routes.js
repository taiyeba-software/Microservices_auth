const express = require("express");
const { registerUserValidator, validate } = require("../middleware/validator.middleware");
const registerUser = require("../controllers/auth.controller");
const loginUser = require("../controllers/login.controller");

const router = express.Router();

router.post("/register", registerUserValidator, validate, registerUser);
router.post("/login", loginUser);

module.exports = router;