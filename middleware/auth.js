const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Look for the token in headers
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user payload to the request object
        next(); // Pass control to the next handler
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};