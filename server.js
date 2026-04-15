const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Global Middleware
app.use(express.json());
app.use(cors());

// Database Connection
if (!process.env.MONGO_URI) {
    console.error("❌ FATAL ERROR: MONGO_URI is not defined.");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => {
        console.error("❌ MongoDB Connection Failed:");
        console.error(err.message);
        process.exit(1);
    });

// Route Mounting
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: "API Endpoint Not Found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 PrivaSync Core running on port ${PORT}`));
