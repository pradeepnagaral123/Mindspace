import express from "express";
import Mood from "../models/Mood.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { mood, stress, energy, note } = req.body;
    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }
    const entry = await Mood.create({
      user: req.user._id,
      mood,
      stress,
      energy,
      note,
    });
    res.status(201).json({ mood: entry });
  } catch (error) {
    console.error("Create mood error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/latest", auth, async (req, res) => {
  try {
    const mood = await Mood.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ mood: mood || null });
  } catch (error) {
    console.error("Get mood error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/stats", auth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moods = await Mood.find({
      user: req.user._id,
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: -1 });

    const moodScoreMap = {
      great: 5,
      good: 4,
      okay: 3,
      low: 2,
      struggling: 1,
    };

    const avg =
      moods.length > 0
        ? moods.reduce((sum, m) => sum + (moodScoreMap[m.mood] || 3), 0) /
          moods.length
        : 3;

    const stress = Math.round(6 - avg);
    const energy = Math.round(avg * 0.8 + Math.random());
    const mood = Math.round(avg);

    res.json({
      stress: Math.min(5, Math.max(1, stress)),
      energy: Math.min(5, Math.max(1, energy)),
      mood: Math.min(5, Math.max(1, mood)),
      totalCheckIns: moods.length,
    });
  } catch (error) {
    console.error("Get mood stats error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!mood) {
      return res.status(404).json({ message: "Check-in not found" });
    }
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete mood error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/history", auth, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ moods });
  } catch (error) {
    console.error("Get mood history error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
