const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const User = require("../models/user.modal");
const auth = require("../middleware/auth.middleware");

router.use(express.json());

function validate(req) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(100).required(),
  });

  return schema.validate(req);
}

async function hashPassword(password) {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

router.post("/signup", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, email, password } = req.body;

  const hashedPassword = await hashPassword(password);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res
      .status(201)
      .json({ message: "User signed up successfully", user: newUser });
  } catch (err) {
    res
      .status(500)
      .send("An unexpected error occurred. Please try again later.");
  }
});

router.put("/update/:id", auth, async (req, res) => {
  if (req.user.id !== req.params.id)
    return res.status(401).send("You are not allowed to update this user");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username,
          email,
          password: hashedPassword,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).send(rest);
  } catch (error) {
    res.status(500).send("Something went wrong. Please try again later.");
  }
});
router.delete("/delete/:id", auth, async (req, res) => {
  if (!req.user.isAdmin && req.user.id !== req.params.id)
    return res.status(401).send("You are not allowed to update this user");

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (error) {
    res.status(500).send("Something went wrong. Please try again later.");
  }
});
router.post("/signout", async (req, res) => {
  try {
    res.clearCookie("auth_token").status(200).json("User has been signed out");
  } catch (error) {
    res.status(500).send("Something went wrong. Please try again later.");
  }
});
router.get("/getusers", auth, async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(401).send("You are not allowed to see all user");
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    res.status(500).send("Something went wrong. Please try again later.");
  }
});

module.exports = router;
