const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config({ path: "../.env" });

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch(err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;