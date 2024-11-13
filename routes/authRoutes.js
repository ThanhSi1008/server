const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import your User model
require("dotenv").config();
const router = express.Router();

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req._id = decoded._id;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Route to signup a new user
router.post("/signup", async (req, res) => {
  const { fullName, email, phoneNumber, username, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { "account.username": username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or username already exists." });
    }
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user
    const newUser = new User({
      full_name: fullName,
      email,
      phone_number: phoneNumber,
      account: { username: username, password: hashedPassword },
    });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with token and user info
    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        _id: newUser._id,
        full_name: newUser.full_name,
        phone_number: newUser.phone_number,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.log(error)
  }
});

// Route to login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ "account.username": username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password using bcrypt
    const isMatch = await bcrypt.compare(password, user.account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        full_name: user.full_name,
        phone_number: user.phone_number,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// Route to get the current user's information
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user._id,
      full_name: user.full_name,
      phone_number: user.phone_number,
      email: user.email,
      dob: user.dob,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = router;
