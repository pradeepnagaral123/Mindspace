import express from "express";
import Saved from "../models/Saved.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const VALID_TYPES = ["post", "resource", "community"];

// GET /api/saved — list all saved items for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const items = await Saved.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ items });
  } catch (error) {
    console.error("Get saved error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/saved — save an item (idempotent per type + refId)
router.post("/", auth, async (req, res) => {
  try {
    const { itemType, refId, title, description, category, meta, icon, accent } =
      req.body;
    if (!VALID_TYPES.includes(itemType)) {
      return res.status(400).json({ message: "Invalid item type" });
    }
    if (!refId) {
      return res.status(400).json({ message: "Item id is required" });
    }

    const item = await Saved.findOneAndUpdate(
      { user: req.user._id, itemType, refId },
      {
        title: (title || "").slice(0, 300),
        description: (description || "").slice(0, 1000),
        category: (category || "").slice(0, 100),
        meta: (meta || "").slice(0, 200),
        icon: (icon || "").slice(0, 60),
        accent: (accent || "").slice(0, 120),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ item });
  } catch (error) {
    console.error("Save item error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/saved/:type/:refId — unsave an item
router.delete("/:type/:refId", auth, async (req, res) => {
  try {
    const { type, refId } = req.params;
    const result = await Saved.findOneAndDelete({
      user: req.user._id,
      itemType: type,
      refId,
    });
    if (!result) {
      return res.status(404).json({ message: "Saved item not found" });
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("Unsave item error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
