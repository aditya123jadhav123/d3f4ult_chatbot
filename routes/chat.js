const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// @route   POST /api/chat
// @desc    Send prompt to Gemini AI (Protected Route)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt cannot be empty' });
        }

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text });

    } catch (err) {
        console.error("AI Generation Error:", err);
        res.status(500).json({ error: 'Failed to communicate with AI provider.' });
    }
});

module.exports = router;