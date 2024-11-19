const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    theater_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Theater",
    },
    room_name: { type: String, required: true },
    capacity: { type: Number, required: true },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
