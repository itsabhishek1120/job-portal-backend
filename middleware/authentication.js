const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  // First check in the Authorization header
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log("Cookie>>>",req.cookies);

  // If no token in headers, check in cookies
  if (!token) {
    const tokenFromCookies = req.cookies.token; // Get the token from cookies
    if (!tokenFromCookies) {
      return res.status(401).json({ success: false, message: 'Access token is missing or invalid' });
    }
    // Use the token from cookies if it's available
    req.token = tokenFromCookies;
  } else {
    req.token = token;
  }

  try {
    const decoded = jwt.verify(req.token, process.env.PASS_SECRET);
    console.log("decoded :", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authenticateJWT;
