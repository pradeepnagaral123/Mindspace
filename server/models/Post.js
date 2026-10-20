import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
          maxlength: 1000,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

postSchema.index({ community: 1, createdAt: -1 });

export default mongoose.model("Post", postSchema);
