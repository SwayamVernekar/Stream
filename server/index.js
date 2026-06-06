// ─────────────────────────────────────────────────────────
//  Stream Platform — Entry Point
//  Basic Express + Socket.io server setup
// ─────────────────────────────────────────────────────────

const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// ── Express App ──────────────────────────────────────────

const app = express();

// Enable CORS for all origins (will be restricted in production)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ── HTTP + Socket.io Server ──────────────────────────────

const server = http.createServer(app);

// Attach Socket.io to the HTTP server with CORS enabled for all origins
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ── Routes ───────────────────────────────────────────────

// Health check endpoint — useful for monitoring & load balancers
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Auth routes — register, login, get current user
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Stream routes — start, stop, list active, get by key
const streamRoutes = require("./routes/stream");
app.use("/api/stream", streamRoutes);

// ── Socket.io Events ─────────────────────────────────────

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ── Start Server ─────────────────────────────────────────

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start listening for requests
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
