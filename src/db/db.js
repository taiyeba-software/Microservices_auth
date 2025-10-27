const mongoose = require("mongoose");

function connectDB(){
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("✅MongoDB connected");
    }catch(err){
        console.error("❌MongoDB connection failed:",err);
    }
}

module.exports = connectDB;