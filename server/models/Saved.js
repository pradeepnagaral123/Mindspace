import mongoose from "mongoose";

const savedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemType: {
      type: String,
      enum: ["post", "resource", "community"],
      required: true,
    },
    refId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    meta: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    icon: {
      type: String,
      trim: true,
      maxlength: 60,
      default: "",
    },
    accent: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
  },
  { timestamps: true }
);

savedSchema.index({ user: 1, itemType: 1, refId: 1 }, { unique: true });
savedSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Saved", savedSchema);
