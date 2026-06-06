// ─────────────────────────────────────────────────────────
//  Stream Routes — Start, Stop, List Active, Get by Key
// ─────────────────────────────────────────────────────────

const express = require("express");

const Stream = require("../models/Stream");
const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

// ─────────────────────────────────────────────────────────
//  POST /api/stream/start  (Protected)
//  Start a new live stream for the authenticated user
// ─────────────────────────────────────────────────────────

router.post("/start", protect, async (req, res) => {
  try {
    const { title } = req.body;

    // --- Validation ---
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Get the full user (protect middleware excludes password)
    const user = req.user;

    // Check if the user is already streaming
    if (user.isLive) {
      return res.status(400).json({ message: "Already streaming" });
    }

    // --- Reuse existing Stream document or create a new one ---
    // Prevents E11000 duplicate key errors on the streamKey field
    let stream = await Stream.findOne({ streamKey: user.streamKey });

    if (stream) {
      // Existing document found — reactivate it
      stream.title = title;
      stream.isLive = true;
      stream.startedAt = Date.now();
      stream.viewerCount = 0;
      await stream.save();
    } else {
      // First time streaming — create a new document
      stream = await Stream.create({
        title,
        userId: user._id,
        streamKey: user.streamKey,
        isLive: true,
        startedAt: Date.now(),
      });
    }

    // --- Mark the user as live ---
    await User.findByIdAndUpdate(user._id, { isLive: true });

    res.status(201).json({ stream });
  } catch (error) {
    console.error("Start stream error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────
//  POST /api/stream/stop  (Protected)
//  Stop the authenticated user's active stream
// ─────────────────────────────────────────────────────────

router.post("/stop", protect, async (req, res) => {
  try {
    const user = req.user;

    // Find the user's active stream
    const stream = await Stream.findOne({
      streamKey: user.streamKey,
      isLive: true,
    });

    if (!stream) {
      return res.status(404).json({ message: "No active stream found" });
    }

    // --- End the stream ---
    stream.isLive = false;
    await stream.save();

    // --- Mark the user as offline ---
    await User.findByIdAndUpdate(user._id, { isLive: false });

    res.json({ message: "Stream ended" });
  } catch (error) {
    console.error("Stop stream error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────
//  GET /api/stream/active  (Public)
//  Return all currently live streams
// ─────────────────────────────────────────────────────────

router.get("/active", async (req, res) => {
  try {
    const streams = await Stream.find({ isLive: true })
      .populate("userId", "username")
      .sort({ startedAt: -1 });

    res.json({ streams });
  } catch (error) {
    console.error("Get active streams error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────
//  GET /api/stream/:streamKey  (Public)
//  Return a single stream by its stream key
// ─────────────────────────────────────────────────────────

router.get("/:streamKey", async (req, res) => {
  try {
    const stream = await Stream.findOne({ streamKey: req.params.streamKey })
      .populate("userId", "username");

    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }

    res.json({ stream });
  } catch (error) {
    console.error("Get stream error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
