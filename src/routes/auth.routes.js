const express = require("express");
const {registerUserValidator,validate} =require("../middleware/validator.middleware");
const authController =require("../controllers/auth.controller");



const router = express.Router();

router.post("/register", validator.registerUserValidator, validator.validate, authController.registerUser);


module.exports = router;