const express = require("express");
const Order = require("../models/order"); // Import the Order model
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

// Route to get all orders for the current user with screening and movie details
router.get("/", protect, async (req, res, next) => {
  try {
    const userId = req.user._id; // Current user's ID

    // Fetch orders for the current user
    const orders = await Order.find({ "user.user_id": userId })
    .sort({ order_date: -1 })
      .populate({
        path: "screening_id", // Populate screening details
        model: "Screening",
        populate: [
          {
            path: "movie_id", // Populate movie details
            model: "Movie",
            select: "movie_name", // Only include movie_name
          },
        ],
      })
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    // Format response to include required details
    const formattedOrders = orders.map((order) => {
      const screening = order.screening_id;
      const movie = screening?.movie_id;

      return {
        order_id: order.order_id,
        order_date: order.order_date,
        total: order.total,
        seats: order.seats,
        products: order.products,
        movie_name: movie?.movie_name || "N/A",
        screening_time: screening?.screening_time,
        end_time: screening?.end_time,
        room_name: screening?.room?.room_name || "N/A",
        theater_name: screening?.theater?.theater_name || "N/A",
        address: screening?.theater?.address || "N/A",
        ticket_price: screening?.ticket_price || "N/A",
      };
    });

    res.status(200).json({
      message: "Orders retrieved successfully.",
      orders: formattedOrders,
    });
  } catch (error) {
    next(error);
  }
});


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
