const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Middleware to protect the route
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// @route   POST api/chat
router.post('/', auth, async (req, res) => {
    try {
        const { prompt } = req.body;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;