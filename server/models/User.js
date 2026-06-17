// ─────────────────────────────────────────────────────────
//  User Model
// ─────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Display name — must be unique across the platform
  username: {
    type: String,
    required: true,
    unique: true,
  },

  // Account email — used for login & notifications
  email: {
    type: String,
    required: true,
    unique: true,
  },

  // Hashed password (bcrypt) — not required for Google OAuth users
  password: {
    type: String,
    required: false,
  },

  // Google OAuth subject ID (unique per Google account)
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },

  // How the user signed up
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  // Unique key used to authenticate an incoming stream (generated later)
  streamKey: {
    type: String,
    unique: true,
  },

  // Whether the user is currently broadcasting
  isLive: {
    type: Boolean,
    default: false,
  },

  // Account creation timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
