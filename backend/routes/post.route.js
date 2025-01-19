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
module.exports = router;
