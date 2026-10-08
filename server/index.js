import "./config/env.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import journalRoutes from "./routes/journal.js";
import moodRoutes from "./routes/mood.js";
import connectionRoutes from "./routes/connection.js";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Render terminates TLS at its proxy; trust X-Forwarded-* so req.protocol/hostname are correct
app.set("trust proxy", 1);

// Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.json({ message: "MindSpace API is running" });
});

// Start server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
