const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // This looks for the file named .env automatically

const app = express();
app.use(express.json());
app.use(cors());

// Check if variables are loading (for debugging)
console.log("URI Check:", process.env.MONGO_URI ? "Key exists in .env" : "Key is MISSING");

const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ DB Error:", err.message));

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));

app.use('/api/chat', require('./routes/chat'));