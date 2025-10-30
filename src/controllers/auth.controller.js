/*

const userModel =require('../models/user.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


async function registerUser(req, res) {
    const { username, email, password, fullname } = req.body;
    const firstname = fullname?.firstname || "";
    const lastname = fullname?.lastname || "";


    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {username},
            {email},
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({message:"username and email alrady exists"});
    }

    const hash = await bcrypt.hash(password,10);

    const user =await userModel.create({
        username,
        email,
        password:hash,

        fullname:{firstname ,lastname}
    })


    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn:"1d"});

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    })

   return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role || "user", // ✅ fallback
        address: user.address || null
      }
    });

  
}

module.exports = registerUser;
*/
/*
const userModel = require('../models/user.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { username, email, password, fullname } = req.body;
    const firstname = fullname?.firstname || "";
    const lastname = fullname?.lastname || "";

    
    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }]
    });

    if (isUserAlreadyExists) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    // hash password
    const hash = await bcrypt.hash(password, 10);

    // create new user
    const user = await userModel.create({
      username,
      email,
      password: hash,
      fullname: { firstname, lastname }
    });

    // create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // set cookie (local test → secure: false)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    // send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role || "user",
        address: user.address || []
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = registerUser;
*/
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
  try {
    const { username, email, password, fullname } = req.body;

    // 🧠 Check required fields
    if (!username || !email || !password || !fullname?.firstname || !fullname?.lastname) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔍 Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧾 Create new user
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      fullname,
    });

    // 🎫 Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // ✅ fixed typo (was expireIn)
    );

    // 🍪 Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 🎉 Send clean response (also include top-level fields for tests/clients)
    return res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullname: user.fullname,
        address: user.address || [],
      },
    });

  } catch (err) {
    console.error("❌ Registration Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = registerUser;
