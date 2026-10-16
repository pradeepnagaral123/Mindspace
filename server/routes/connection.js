import express from "express";
import mongoose from "mongoose";
import Connection from "../models/Connection.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import { getIO } from "../socket.js";

const router = express.Router();

router.get("/suggestions", auth, async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ user: req.user._id }, { peer: req.user._id }],
    }).select("user peer");

    const myId = req.user._id.toString();
    const connectedIds = new Map();
    connections.forEach((c) => {
      const other =
        c.user.toString() === myId ? c.peer.toString() : c.user.toString();
      connectedIds.set(other, c._id.toString());
    });

    const users = await User.find({
      isVerified: true,
      _id: { $ne: req.user._id },
    })
      .select("name avatar createdAt")
      .sort({ createdAt: -1 })
      .limit(24);

    res.json({
      users: users.map((u) => ({
        ...u.toObject(),
        connected: connectedIds.has(u._id.toString()),
        connectionId: connectedIds.get(u._id.toString()) || null,
      })),
    });
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

    const socketPayload = {
      connectionId: connection._id.toString(),
      peer: {
        _id: peer._id,
        name: peer.name,
        avatar: peer.avatar || null,
      },
    };
    const io = getIO();
    if (io) {
      io.to(`user:${req.user._id}`).emit("connection:new", socketPayload);
      io.to(`user:${peerId}`).emit("connection:new", {
        connectionId: connection._id.toString(),
        peer: {
          _id: req.user._id,
          name: req.user.name,
          avatar: req.user.avatar || null,
        },
      });
    }

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
