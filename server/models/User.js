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

  // Hashed password (bcrypt)
  password: {
    type: String,
    required: true,
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
