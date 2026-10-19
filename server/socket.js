import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Connection from "./models/Connection.js";
import Message from "./models/Message.js";
import { notify } from "./utils/notify.js";

const onlineUsers = new Map();

export const isOnline = (userId) => onlineUsers.has(userId.toString());

let io;

export const getIO = () => io;

async function getPeerIds(userId) {
  const connections = await Connection.find({
    $or: [{ user: userId }, { peer: userId }],
    status: "accepted",
  }).select("user peer");
  return connections.map((c) =>
    c.user.toString() === userId.toString()
      ? c.peer.toString()
      : c.user.toString()
  );
}

async function getMembership(connectionId, userId) {
  const connection = await Connection.findOne({
    _id: connectionId,
    status: "accepted",
  });
  if (!connection) return null;
  const uid = userId.toString();
  if (
    connection.user.toString() !== uid &&
    connection.peer.toString() !== uid
  ) {
    return null;
  }
  return connection;
}

export function initSocket(httpServer, corsOrigin) {
  io = new Server(httpServer, {
    cors: { origin: corsOrigin, credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("name avatar");
      if (!user) return next(new Error("Invalid token"));
      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user._id.toString();
    socket.join(`user:${userId}`);

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);
    const isFirstConnection = onlineUsers.get(userId).size === 1;

    if (isFirstConnection) {
      const peerIds = await getPeerIds(userId);
      peerIds.forEach((peerId) => {
        io.to(`user:${peerId}`).emit("presence", { userId, online: true });
      });
    }

    socket.on("message:send", async ({ connectionId, text }, ack) => {
      try {
        if (!text || !text.trim()) return ack?.({ error: "Empty message" });
        const connection = await getMembership(connectionId, socket.user._id);
        if (!connection) return ack?.({ error: "Not allowed" });

        const message = await Message.create({
          connection: connectionId,
          sender: socket.user._id,
          text: text.trim().slice(0, 2000),
        });

        const payload = {
          _id: message._id,
          connection: connectionId,
          sender: {
            _id: socket.user._id,
            name: socket.user.name,
          },
          text: message.text,
          readAt: null,
          createdAt: message.createdAt,
        };

        const peerId =
          connection.user.toString() === userId
            ? connection.peer.toString()
            : connection.user.toString();

        io.to(`user:${userId}`).to(`user:${peerId}`).emit("message:new", payload);

        notify({
          user: peerId,
          type: "message",
          title: "New message",
          body: `${socket.user.name} sent you a message.`,
          link: "/messages",
        });

        ack?.({ ok: true, message: payload });
      } catch (error) {
        console.error("message:send error:", error.message);
        ack?.({ error: "Failed to send" });
      }
    });

    socket.on("typing", async ({ connectionId, typing }) => {
      try {
        const connection = await getMembership(connectionId, socket.user._id);
        if (!connection) return;
        const peerId =
          connection.user.toString() === userId
            ? connection.peer.toString()
            : connection.user.toString();
        io.to(`user:${peerId}`).emit("typing", {
          connectionId,
          userId,
          typing: Boolean(typing),
        });
      } catch {
        // ignore
      }
    });

    socket.on("messages:read", async ({ connectionId }) => {
      try {
        const connection = await getMembership(connectionId, socket.user._id);
        if (!connection) return;
        await Message.updateMany(
          {
            connection: connectionId,
            sender: { $ne: socket.user._id },
            readAt: null,
          },
          { $set: { readAt: new Date() } }
        );
        const peerId =
          connection.user.toString() === userId
            ? connection.peer.toString()
            : connection.user.toString();
        io.to(`user:${peerId}`).emit("messages:read", {
          connectionId,
          readBy: userId,
        });
      } catch (error) {
        console.error("messages:read error:", error.message);
      }
    });

    socket.on("message:delete", async ({ messageId }, ack) => {
      try {
        if (!messageId) return ack?.({ error: "Invalid message" });
        const message = await Message.findById(messageId).populate("connection");
        if (!message || !message.connection) {
          return ack?.({ error: "Message not found" });
        }
        const connection = message.connection;
        const isMember =
          connection.user.toString() === userId ||
          connection.peer.toString() === userId;
        if (!isMember) return ack?.({ error: "Not allowed" });
        if (message.sender.toString() !== userId) {
          return ack?.({ error: "You can only delete your own messages" });
        }

        const peerId =
          connection.user.toString() === userId
            ? connection.peer.toString()
            : connection.user.toString();

        if (message.deleted) {
          await Message.deleteOne({ _id: message._id });
          io.to(`user:${userId}`)
            .to(`user:${peerId}`)
            .emit("message:removed", {
              connectionId: connection._id.toString(),
              messageId: message._id.toString(),
            });
          return ack?.({ ok: true, removed: true });
        }

        await Message.updateOne(
          { _id: message._id },
          { $set: { deleted: true, deletedAt: new Date(), text: "" } }
        );

        io.to(`user:${userId}`)
          .to(`user:${peerId}`)
          .emit("message:deleted", {
            connectionId: connection._id.toString(),
            messageId: message._id.toString(),
          });
        ack?.({ ok: true });
      } catch (error) {
        console.error("message:delete error:", error.message);
        ack?.({ error: "Failed to delete" });
      }
    });

    socket.on("disconnect", async () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          const peerIds = await getPeerIds(userId);
          peerIds.forEach((peerId) => {
            io.to(`user:${peerId}`).emit("presence", { userId, online: false });
          });
        }
      }
    });
  });

  return io;
}
