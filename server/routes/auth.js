import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import { sendVerificationEmail } from "../utils/email.js";

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const VERIFY_TOKEN_TTL = 24 * 60 * 60 * 1000; // 24 hours

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
});

const createVerifyToken = () => crypto.randomBytes(32).toString("hex");

const issueVerifyToken = async (user) => {
  user.verifyToken = createVerifyToken();
  user.verifyTokenExpires = Date.now() + VERIFY_TOKEN_TTL;
  await user.save({ validateBeforeSave: false });
  return user.verifyToken;
};

const sendOrLogVerification = async (user, token) => {
  try {
    await sendVerificationEmail(user.email, token);
  } catch (error) {
    // Registration still succeeds; log the link so the account isn't stuck
    console.error("Verification email failed:", error.message);
    const verifyUrl = `${CLIENT_URL}/verify?token=${token}`;
    console.error(`Verify link for ${user.email}: ${verifyUrl}`);
  }
};

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
      if (existingUser.isVerified === false) {
        // Unverified account retrying: resend the link instead of blocking
        const token = await issueVerifyToken(existingUser);
        await sendOrLogVerification(existingUser, token);
        return res.status(201).json({
          needsVerification: true,
          message: `An account with this email is awaiting verification. We've sent a new link to ${email}.`,
        });
      }
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
    });

    const token = await issueVerifyToken(user);
    await sendOrLogVerification(user, token);

    res.status(201).json({
      needsVerification: true,
      message: `We've sent a verification link to ${email}. Please verify your email to continue.`,
    });
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

    if (user.isVerified === false) {
      return res.status(403).json({
        needsVerification: true,
        message: "Please verify your email before signing in.",
      });
    }

    const token = generateToken(user._id);
    res.json({ user: sanitizeUser(user), token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/verify?token=...
router.get("/verify", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Verification token is missing" });
    }

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "This verification link is invalid or has expired." });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ message: "Your email has been verified. You can now sign in." });
  } catch (error) {
    console.error("Verify error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/resend-verification { email }
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (user && user.isVerified !== false) {
      return res.json({ message: "This email is already verified. Try signing in." });
    }
    if (!user) {
      // Don't reveal whether the account exists
      return res.json({
        message: `If an unverified account exists for ${email}, a new verification link has been sent.`,
      });
    }

    const token = await issueVerifyToken(user);
    await sendOrLogVerification(user, token);

    res.json({ message: `If an unverified account exists for ${email}, a new verification link has been sent.` });
  } catch (error) {
    console.error("Resend verification error:", error.message);
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
