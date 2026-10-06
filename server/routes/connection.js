import express from "express";
import Connection from "../models/Connection.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const connections = await Connection.find({
      user: req.user._id,
      status: "accepted",
    })
      .populate("peer", "name avatar")
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({ connections });
  } catch (error) {
    console.error("Get connections error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/count", auth, async (req, res) => {
  try {
    const count = await Connection.countDocuments({
      user: req.user._id,
      status: "accepted",
    });
    res.json({ count });
  } catch (error) {
    console.error("Count connections error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
