const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token is missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.PASS_SECRET);
    console.log("decoded :",decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authenticateJWT;
