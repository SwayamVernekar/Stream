// ─────────────────────────────────────────────────────────
//  Auth Middleware — JWT Protection
// ─────────────────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect middleware
 * - Reads the JWT from the Authorization header (Bearer <token>)
 * - Verifies it against JWT_SECRET
 * - Attaches the decoded user (without password) to req.user
 * - Returns 401 if the token is missing or invalid
 */
const protect = async (req, res, next) => {
  try {
    // Extract token from "Bearer <token>" header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = protect;
