import express from "express";
import Connection from "../models/Connection.js";
import Message from "../models/Message.js";
import auth from "../middleware/auth.js";
import { isOnline } from "../socket.js";

const router = express.Router();

router.get("/threads", auth, async (req, res) => {
  try {
    const uid = req.user._id;
    const connections = await Connection.find({
      $or: [{ user: uid }, { peer: uid }],
      status: "accepted",
    })
      .populate("user", "name avatar")
      .populate("peer", "name avatar")
      .sort({ updatedAt: -1 });

    const connIds = connections.map((c) => c._id);

    const [recent, unreadGroups] = await Promise.all([
      Message.find({ connection: { $in: connIds } })
        .sort({ createdAt: -1 })
        .select("connection text createdAt readAt sender"),
      Message.aggregate([
        {
          $match: {
            connection: { $in: connIds },
            sender: { $ne: uid },
            readAt: null,
          },
        },
        { $group: { _id: "$connection", count: { $sum: 1 } } },
      ]),
    ]);

    const lastByConnection = {};
    recent.forEach((m) => {
      const key = m.connection.toString();
      if (!lastByConnection[key]) lastByConnection[key] = m;
    });

    const unreadByConnection = {};
    unreadGroups.forEach((g) => {
      unreadByConnection[g._id.toString()] = g.count;
    });

    const threads = connections.map((c) => {
      const isMine = c.user._id.toString() === uid.toString();
      const peer = isMine ? c.peer : c.user;
      const key = c._id.toString();
      const last = lastByConnection[key];
      return {
        connectionId: key,
        peer: {
          _id: peer._id,
          name: peer.name,
          avatar: peer.avatar || null,
          online: isOnline(peer._id),
        },
        lastMessage: last ? last.text : "",
        lastMessageAt: last ? last.createdAt : c.createdAt,
        unread: unreadByConnection[key] || 0,
      };
    });

    res.json({ threads });
  } catch (error) {
    console.error("Get threads error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:connectionId", auth, async (req, res) => {
  try {
    const uid = req.user._id;
    const connection = await Connection.findOne({
      _id: req.params.connectionId,
      status: "accepted",
    });
    if (!connection) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (
      connection.user.toString() !== uid.toString() &&
      connection.peer.toString() !== uid.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const messages = await Message.find({ connection: connection._id })
      .sort({ createdAt: 1 })
      .limit(200)
      .populate("sender", "name avatar");

    res.json({ messages });
  } catch (error) {
    console.error("Get messages error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
