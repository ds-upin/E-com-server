require("dotenv").config()
const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
    try {
        const token = req.cookies.token; 
        //console.log("auth token",token);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized1: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded,"--");
        //console.log(process.env.ADMIN_PIN,"--");
        //console.log(process.env.ADMIN_EMAIL,"--");
        if(decoded.email==process.env.ADMIN_EMAIL && decoded.pincode==process.env.ADMIN_PIN){
            req.user = decoded; 
            //console.log(decoded);
            return next();
        }
        return res.status(401).json({ error: 'Unauthorized2: No token provided' });
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(401).json({ error: 'Unauthorized3: Invalid or expired token' });
    }
};

module.exports = authAdmin;
