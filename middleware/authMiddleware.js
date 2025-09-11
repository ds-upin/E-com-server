const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token; // or whatever your cookie name is
        console.log(token);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log("decode",decode);
        req.user = decoded; // attach user info to request
        next();
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports = authMiddleware;
