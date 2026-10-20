import express from "express";
import mongoose from "mongoose";
import Community from "../models/Community.js";
import CommunityMember from "../models/CommunityMember.js";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";
import { notify } from "../utils/notify.js";

const router = express.Router();

const SEED_COMMUNITIES = [
  {
    name: "Student Support Circle",
    description: "Exams, deadlines and everything in between. We get it.",
    category: "Support",
    icon: "graduationCap",
    accent: "bg-mint-soft text-mint-deep",
  },
  {
    name: "Anxiety Relief",
    description: "Gentle practices and kind words for anxious days.",
    category: "Wellbeing",
    icon: "wind",
    accent: "bg-lavender-soft text-lavender-deep",
  },
  {
    name: "Mindful Moments",
    description: "Slow down, breathe and notice the small good things.",
    category: "Mindfulness",
    icon: "flower2",
    accent: "bg-blossom-soft text-blossom-deep",
  },
  {
    name: "New Parents United",
    description: "Sleepless nights, big feelings and tiny victories.",
    category: "Support",
    icon: "usersRound",
    accent: "bg-peach-soft text-peach-deep",
  },
  {
    name: "Sleep Better Together",
    description: "Wind-down rituals and stories to help you rest.",
    category: "Wellbeing",
    icon: "sparkles",
    accent: "bg-sun-soft text-sun-deep",
  },
  {
    name: "Breathwork Circle",
    description: "Five minutes a day to reset your nervous system.",
    category: "Mindfulness",
    icon: "wind",
    accent: "bg-mint-soft text-mint-deep",
  },
  {
    name: "Grief & Loss",
    description: "A soft place to sit with loss — at your own pace.",
    category: "Support",
    icon: "cloudRain",
    accent: "bg-lavender-soft text-lavender-deep",
  },
  {
    name: "Self-Care Daily",
    description: "Small habits, gentle reminders, one day at a time.",
    category: "Wellbeing",
    icon: "smile",
    accent: "bg-blossom-soft text-blossom-deep",
  },
  {
    name: "Meditation Pals",
    description: "Guided sits and shared quiet — together is easier.",
    category: "Mindfulness",
    icon: "compass",
    accent: "bg-mint-soft text-mint-deep",
  },
];

async function ensureSeed() {
  const names = SEED_COMMUNITIES.map((c) => c.name);
  const existing = await Community.find({ name: { $in: names } }).select(
    "name"
  );
  const existingNames = new Set(existing.map((c) => c.name));
  const missing = SEED_COMMUNITIES.filter((c) => !existingNames.has(c.name));
  if (missing.length) {
    await Community.insertMany(missing);
  }
}

const shapeCommunity = (
  community,
  memberCount,
  joinedByMe,
  createdByMe = false
) => ({
  _id: community._id,
  name: community.name,
  description: community.description,
  category: community.category,
  icon: community.icon,
  accent: community.accent,
  memberCount,
  joinedByMe,
  createdByMe,
});

router.get("/", auth, async (req, res) => {
  try {
    await ensureSeed();
    const communities = await Community.find().sort({ createdAt: 1 });
    const myMemberships = await CommunityMember.find({
      user: req.user._id,
    }).select("community");
    const joinedIds = new Set(
      myMemberships.map((m) => m.community.toString())
    );

    const counts = await CommunityMember.aggregate([
      { $group: { _id: "$community", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(
      counts.map((c) => [c._id.toString(), c.count])
    );

    const userId = req.user._id.toString();
    res.json({
      communities: communities.map((c) =>
        shapeCommunity(
          c,
          countMap.get(c._id.toString()) || 0,
          joinedIds.has(c._id.toString()),
          Boolean(c.createdBy) && c.createdBy.toString() === userId
        )
      ),
    });
  } catch (error) {
    console.error("Get communities error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, description, category, icon, accent } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Community name is required" });
    }
    const community = await Community.create({
      name: name.trim().slice(0, 80),
      description: (description || "").trim().slice(0, 300),
      category:
        ["Support", "Wellbeing", "Mindfulness"].includes(category)
          ? category
          : "Support",
      icon: icon || "graduationCap",
      accent: accent || "bg-mint-soft text-mint-deep",
      createdBy: req.user._id,
    });
    await CommunityMember.create({
      community: community._id,
      user: req.user._id,
      role: "owner",
    });
    res.status(201).json({
      community: shapeCommunity(community, 1, true, true),
    });
  } catch (error) {
    console.error("Create community error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid community" });
    }
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    if (
      !community.createdBy ||
      community.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this community" });
    }
    await Promise.all([
      CommunityMember.deleteMany({ community: community._id }),
      Post.deleteMany({ community: community._id }),
    ]);
    await community.deleteOne();
    res.json({ ok: true });
  } catch (error) {
    console.error("Delete community error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid community" });
    }
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const [memberCount, membership] = await Promise.all([
      CommunityMember.countDocuments({ community: community._id }),
      CommunityMember.findOne({
        community: community._id,
        user: req.user._id,
      }),
    ]);
    res.json({
      community: shapeCommunity(
        community,
        memberCount,
        Boolean(membership),
        Boolean(community.createdBy) &&
          community.createdBy.toString() === req.user._id.toString()
      ),
    });
  } catch (error) {
    console.error("Get community error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/join", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid community" });
    }
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const existing = await CommunityMember.findOne({
      community: community._id,
      user: req.user._id,
    });
    if (existing) {
      return res.json({ ok: true, joined: true });
    }
    await CommunityMember.create({
      community: community._id,
      user: req.user._id,
    });
    const memberCount = await CommunityMember.countDocuments({
      community: community._id,
    });
    res.status(201).json({ ok: true, joined: true, memberCount });
  } catch (error) {
    console.error("Join community error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id/leave", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid community" });
    }
    await CommunityMember.deleteOne({
      community: req.params.id,
      user: req.user._id,
    });
    const memberCount = await CommunityMember.countDocuments({
      community: req.params.id,
    });
    res.json({ ok: true, joined: false, memberCount });
  } catch (error) {
    console.error("Leave community error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/members", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid community" });
    }
    const members = await CommunityMember.find({
      community: req.params.id,
    })
      .sort({ createdAt: 1 })
      .limit(6)
      .populate("user", "name avatar");
    res.json({
      members: members.map((m) => ({
        _id: m._id,
        name: m.user?.name || "Member",
        role: m.role,
      })),
    });
  } catch (error) {
    console.error("Get members error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/posts", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid community" });
    }
    const posts = await Post.find({ community: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("author", "name avatar");

    res.json({
      posts: posts.map((post) => ({
        _id: post._id,
        text: post.text,
        author: post.author
          ? { _id: post.author._id, name: post.author.name }
          : null,
        likeCount: post.likes.length,
        likedByMe: post.likes.some(
          (id) => id.toString() === req.user._id.toString()
        ),
        createdAt: post.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get posts error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/posts", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid community" });
    }
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Post text is required" });
    }
    const membership = await CommunityMember.findOne({
      community: req.params.id,
      user: req.user._id,
    });
    if (!membership) {
      return res
        .status(403)
        .json({ message: "Join the community to post" });
    }

    const post = await Post.create({
      community: req.params.id,
      author: req.user._id,
      text: text.trim().slice(0, 2000),
    });

    const members = await CommunityMember.find({
      community: req.params.id,
      user: { $ne: req.user._id },
    }).select("user");
    members.forEach((member) => {
      notify({
        user: member.user,
        type: "system",
        title: "New community post",
        body: `${req.user.name} posted in the community.`,
        link: `/communities/${req.params.id}`,
      });
    });

    res.status(201).json({
      post: {
        _id: post._id,
        text: post.text,
        author: { _id: req.user._id, name: req.user.name },
        likeCount: 0,
        likedByMe: false,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    console.error("Create post error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/posts/:id/like", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const userId = req.user._id.toString();
    const liked = post.likes.some((id) => id.toString() === userId);
    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ liked: !liked, likeCount: post.likes.length });
  } catch (error) {
    console.error("Like post error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/posts/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post" });
    }
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Post text is required" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }
    post.text = text.trim().slice(0, 2000);
    await post.save();
    res.json({ post: { _id: post._id, text: post.text } });
  } catch (error) {
    console.error("Edit post error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/posts/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }
    await post.deleteOne();
    res.json({ ok: true });
  } catch (error) {
    console.error("Delete post error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
