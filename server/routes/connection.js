import express from "express";
import mongoose from "mongoose";
import Connection from "../models/Connection.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/suggestions", auth, async (req, res) => {
  try {
    const existing = await Connection.find({
      $or: [{ user: req.user._id }, { peer: req.user._id }],
    }).select("user peer");

    const excludeIds = new Set([req.user._id.toString()]);
    existing.forEach((c) => {
      excludeIds.add(c.user.toString());
      excludeIds.add(c.peer.toString());
    });

    const users = await User.find({
      isVerified: true,
      _id: { $nin: [...excludeIds] },
    })
      .select("name avatar createdAt")
      .sort({ createdAt: -1 })
      .limit(12);

    res.json({ users });
  } catch (error) {
    console.error("Get suggestions error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { peerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(peerId)) {
      return res.status(400).json({ message: "Invalid peer" });
    }
    if (peerId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot connect with yourself" });
    }

    const peer = await User.findOne({ _id: peerId, isVerified: true });
    if (!peer) {
      return res.status(404).json({ message: "Peer not found" });
    }

    const existing = await Connection.findOne({
      $or: [
        { user: req.user._id, peer: peerId },
        { user: peerId, peer: req.user._id },
      ],
    });
    if (existing) {
      return res.status(409).json({ message: "Already connected" });
    }

    const connection = await Connection.create({
      user: req.user._id,
      peer: peerId,
      status: "accepted",
    });
    await connection.populate("peer", "name avatar");

    res.status(201).json({ connection });
  } catch (error) {
    console.error("Create connection error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

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
