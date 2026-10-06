import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    peer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "accepted",
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

connectionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Connection", connectionSchema);
