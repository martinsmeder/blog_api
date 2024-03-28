const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Signup endpoint
router.post("/signup", async (req, res) => {
  try {
    // Check if maximum user limit has been reached
    const userCount = await User.countDocuments();
    if (userCount >= 3) {
      return res.status(403).json({ message: "Maximum user limit reached" });
    }

    // Extract email and password from request body
    const { email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Return success message
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
