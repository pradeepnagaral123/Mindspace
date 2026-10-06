import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "low", "struggling"],
      required: true,
    },
    stress: { type: Number, min: 1, max: 5, default: 3 },
    energy: { type: Number, min: 1, max: 5, default: 3 },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

moodSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Mood", moodSchema);
