import express from "express";
import Notification from "../models/Notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .select("type title body link read createdAt"),
      Notification.countDocuments({ user: req.user._id, read: false }),
    ]);
    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/count", auth, async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });
    res.json({ unreadCount });
  } catch (error) {
    console.error("Count notifications error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/read-all", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ ok: true });
  } catch (error) {
    console.error("Read-all notifications error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { read: true } },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ notification });
  } catch (error) {
    console.error("Read notification error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
