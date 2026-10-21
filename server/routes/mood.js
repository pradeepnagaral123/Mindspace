import express from "express";
import Mood from "../models/Mood.js";
import auth from "../middleware/auth.js";
import {
  buildStats,
  buildStreak,
  clamp,
  dateKey,
  scoreOf,
  startOfLocalDay,
  weekdayLabel,
} from "../utils/moodStats.js";

const router = express.Router();

const readTz = (req) => {
  const tz = Number(req.query.tz);
  return Number.isFinite(tz) ? tz : 0;
};

router.post("/", auth, async (req, res) => {
  try {
    const { mood, stress, energy, moodScore, note } = req.body;
    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }
    const entry = await Mood.create({
      user: req.user._id,
      mood,
      stress,
      energy,
      moodScore,
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
    const tz = readTz(req);
    const entries = await Mood.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(buildStats(entries, tz));
  } catch (error) {
    console.error("Get mood stats error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/overview", auth, async (req, res) => {
  try {
    const tz = readTz(req);
    const entries = await Mood.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const byDay = new Map();
    for (const entry of entries) {
      const key = dateKey(entry.createdAt, tz);
      if (!byDay.has(key)) byDay.set(key, entry);
    }

    const days = [];
    const today = startOfLocalDay(new Date(), tz);
    for (let offset = 13; offset >= 0; offset--) {
      const date = new Date(today);
      date.setDate(date.getDate() - offset);
      const entry = byDay.get(dateKey(date, tz));
      days.push({
        date: dateKey(date, tz),
        day: weekdayLabel(date, tz),
        hasEntry: Boolean(entry),
        mood: entry?.mood || null,
        value: entry ? clamp(scoreOf(entry), 1, 5) : 0,
        stress: entry?.stress ?? null,
        energy: entry?.energy ?? null,
        moodScore: entry?.moodScore ?? null,
      });
    }

    res.json({
      stats: buildStats(entries, tz),
      days,
      streak: buildStreak(byDay.keys(), tz),
      latest: entries[0] || null,
      entries,
    });
  } catch (error) {
    console.error("Get mood overview error:", error.message);
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
