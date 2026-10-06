import express from "express";
import Journal from "../models/Journal.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/journals — list all journals for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ journals });
  } catch (error) {
    console.error("Get journals error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/journals — create a new journal
router.post("/", auth, async (req, res) => {
  try {
    const { title, text, mood } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Journal text is required" });
    }

    const journal = await Journal.create({
      user: req.user._id,
      title: title?.trim() || "Untitled entry",
      text: text.trim(),
      mood: mood || "okay",
    });

    res.status(201).json({ journal });
  } catch (error) {
    console.error("Create journal error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/journals/:id — delete a journal
router.delete("/:id", auth, async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json({ message: "Journal deleted" });
  } catch (error) {
    console.error("Delete journal error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/journals/count — count journals for the logged-in user
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Journal.countDocuments({ user: req.user._id });
    res.json({ count });
  } catch (error) {
    console.error("Count journals error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
