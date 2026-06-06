// ─────────────────────────────────────────────────────────
//  Stream Model
// ─────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema({
  // Stream title shown to viewers
  title: {
    type: String,
    required: true,
  },

  // Reference to the broadcaster (User document)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Unique key that ties an RTMP ingest to this stream record
  streamKey: {
    type: String,
    required: true,
    unique: true,
  },

  // Whether the stream is currently live
  isLive: {
    type: Boolean,
    default: false,
  },

  // Number of connected viewers (updated in real-time via Socket.io)
  viewerCount: {
    type: Number,
    default: 0,
  },

  // When the stream went live
  startedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Stream", streamSchema);
