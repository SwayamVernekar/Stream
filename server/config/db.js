// ─────────────────────────────────────────────────────────
//  MongoDB Connection via Mongoose
// ─────────────────────────────────────────────────────────

const mongoose = require("mongoose");

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 * Logs success or exits the process on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
