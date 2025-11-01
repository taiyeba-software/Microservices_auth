const userModel = require('../models/user.model');
const jwt = require("jsonwebtoken");

async function authmiddleware(req, res, next) {
    // Get token from cookie (handle undefined cookies object)
    const token = req.cookies?.token;

    if(!token){
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user in database (exclude password)
        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // attach user info to request
        next();
    }
    catch(err) {
        // Handle JWT verification errors with generic message
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = {
    authmiddleware
}