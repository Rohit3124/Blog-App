const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.modal");

router.use(express.json());
async function authenticateUser(clear, hashed) {
  return await bcryptjs.compare(clear, hashed);
}

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(255).required(),
    password: Joi.string().min(6).max(100).required(),
  });

  return schema.validate(req);
}

router.post("/signin", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const isValid = await authenticateUser(req.body.password, user.password);
    if (!isValid) return res.status(400).send("Invalid email or password");

    const token = jwt.sign({ id: user._id }, "Rohit");
    const { password, ...rest } = user._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .send(rest);
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});

module.exports = router;
