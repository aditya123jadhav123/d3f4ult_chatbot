const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please enter all fields' });
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const newUser = new User({ name, email, password });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully. Please login.' });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Please enter all fields' });
        }

        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Validate Password
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Sign Token
        const token = jwt.sign(
            { id: foundUser._id, name: foundUser.name }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        res.json({ 
            token, 
            user: { id: foundUser._id, name: foundUser.name, email: foundUser.email } 
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;