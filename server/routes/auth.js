// ─────────────────────────────────────────────────────────
//  Auth Routes — Register, Login, Get Current User
// ─────────────────────────────────────────────────────────

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

// ─────────────────────────────────────────────────────────
//  Helper — Generate a signed JWT for a given user ID
// ─────────────────────────────────────────────────────────

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ─────────────────────────────────────────────────────────
//  POST /api/auth/register
//  Create a new user account
// ─────────────────────────────────────────────────────────

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // --- Validation ---
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check for duplicate username
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // --- Hash password ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Generate unique stream key ---
    const streamKey = `sk-${uuidv4()}`;

    // --- Create user ---
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      streamKey,
    });

    // --- Respond with token + user (exclude password) ---
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        streamKey: user.streamKey,
        isLive: user.isLive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────
//  POST /api/auth/login
//  Authenticate existing user
// ─────────────────────────────────────────────────────────

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // --- Respond with token + user (exclude password) ---
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        streamKey: user.streamKey,
        isLive: user.isLive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────
//  GET /api/auth/me  (Protected)
//  Return the currently authenticated user
// ─────────────────────────────────────────────────────────

router.get("/me", protect, async (req, res) => {
  try {
    // req.user is already set by the protect middleware (password excluded)
    res.json({ user: req.user });
  } catch (error) {
    console.error("Get current user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
