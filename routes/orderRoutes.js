const express = require("express");
const Order = require("../models/order"); // Import the Order model
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

// Route to create a new order
router.post("/", protect, async (req, res) => {
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
    // Validate required fields
    if (!total || !seats || !screening_id || !products || !user_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new order document
    const newOrder = new Order({
      order_id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for order_id
      total,
      seats,
      screening_id,
      products,
      user
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Respond with the created order
    res.status(201).json({
      message: "Order created successfully.",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating the order:", error);
    res.status(500).json({ message: "Server error while creating the order." });
  }
});

module.exports = router;
