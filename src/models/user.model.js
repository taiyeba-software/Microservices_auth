const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt:{ type: Date, default: Date.now },
  fullname: {
    firstname: { type: String, required: true },
    lastname:  { type: String, required: true }
  },
  address: [addressSchema]
});

const User = mongoose.model("User", userSchema);
module.exports = User;
