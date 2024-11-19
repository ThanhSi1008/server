const mongoose = require("mongoose");

const seatTypeSchema = new mongoose.Schema(
  {
    seat_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    seat_type_name: { type: String, required: true },
    rate: { type: Number, required: true },
  },
  { timestamps: true }
);

const SeatType = mongoose.model("SeatType", seatTypeSchema);

module.exports = SeatType;
