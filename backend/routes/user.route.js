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

router.post("/signup", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, email, password } = req.body;
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

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
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
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
module.exports = router;
