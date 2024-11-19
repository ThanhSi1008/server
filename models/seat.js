const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    seat_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
    seat_location: { type: String, required: true },
    seat_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SeatType",
    },
  },
  { timestamps: true }
);

const Seat = mongoose.model("Seat", seatSchema);

module.exports = Seat;
