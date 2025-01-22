const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const Post = require("../models/post.model");

router.post("/create", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to create a post");
  }
  if (!req.body.title || !req.body.content) {
    return res.status(400).send("Please provide all required fields");
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});
router.get("/getposts", async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});
router.delete("/deletepost/:postId/:userId", auth, async (req, res) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return res.status(401).send("You are not allowed to delete this post");
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    res.status(500).send("Something went wrong. Please try again later.");
  }
});
router.put("/updatepost/:postId/:userId", auth, async (req, res) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return res.status(401).send("You are not allowed to update this post");
  }
  try {
    const updatedpost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          content: req.body.content,
        },
      },
      { new: true }
    );
    res.status(200).json("The post has been updated");
  } catch (error) {
    res.status(500).send("Something went wrong. Please try again later.");
  }
});
module.exports = router;
