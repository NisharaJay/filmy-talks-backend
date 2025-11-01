const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register API
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ fullName, email, password: hashedPassword });

    res.json({ success: true, message: "User registered", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (!checkUser) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: checkUser._id, email: checkUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.json({ success: true, token, user: checkUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
