import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      enum: ["Support", "Wellbeing", "Mindfulness"],
      default: "Support",
    },
    icon: {
      type: String,
      default: "graduationCap",
    },
    accent: {
      type: String,
      default: "bg-mint-soft text-mint-deep",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Community", communitySchema);
