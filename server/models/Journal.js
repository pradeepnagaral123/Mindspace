import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "Untitled entry",
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "low", "awful"],
      default: "okay",
    },
  },
  { timestamps: true }
);

journalSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Journal", journalSchema);
