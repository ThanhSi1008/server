const express = require("express");
const Order = require("../models/order"); // Import the Order model
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

// Route to create a new order
router.post("/", protect, async (req, res, next) => {
  try {
    const {
      total,
      seats,
      screening_id,
      products,
    } = req.body;

    const user = {
      user_id: req.user._id,
      name: req.user.full_name,
      phone_number: req.user.phone_number,
      email: req.user.email
    }
    if (!total || !seats || !screening_id || !products ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newOrder = new Order({
      order_id: new mongoose.Types.ObjectId(),
      total,
      seats,
      screening_id,
      products,
      user
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully.",
      order: savedOrder,
    });
  } catch (error) {
    next(error)
  }
});

module.exports = router;
