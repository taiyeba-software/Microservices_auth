const mongoose = require("mongoose");

async function connectDB(uri) {
    const mongoUri = uri || process.env.MONGO_URI;
    try {
        await mongoose.connect(mongoUri);
        console.log("✅MongoDB connected");
    } catch (err) {
        console.error("❌MongoDB connection failed:", err);
        throw err;
    }
}

async function closeDB() {
    try {
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    } catch (err) {
        console.error("Error during mongoose disconnect:", err);
    }
}

module.exports = { connectDB, closeDB };