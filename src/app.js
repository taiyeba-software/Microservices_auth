const express = require("express");
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware
app.use('/api/auth', authRoutes);

module.exports = app;