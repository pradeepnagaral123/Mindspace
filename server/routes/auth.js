import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.json({ user: sanitizeUser(user), token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

// GET /api/auth/google -> redirect to Google consent screen
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GET /api/auth/google/callback -> verify, issue JWT, bounce back to SPA
router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false, failureRedirect: `${CLIENT_URL}/?auth=failed` },
    (error, user) => {
      if (error || !user) {
        return res.redirect(`${CLIENT_URL}/?auth=failed`);
      }
      const token = generateToken(user._id);
      return res.redirect(
        `${CLIENT_URL}/auth/callback?token=${encodeURIComponent(token)}`
      );
    }
  )(req, res, next);
});

export default router;
