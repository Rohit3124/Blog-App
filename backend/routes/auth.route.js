const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const User = require("../models/user.modal");

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
    res.status(500).send("Error saving the user: " + err.message);
  }
});

module.exports = router;
