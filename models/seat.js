const mongoose = require("mongoose");

// Định nghĩa schema cho seat_type
const seatTypeSchema = new mongoose.Schema({
  seat_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  seat_type_name: { type: String, required: true },
  rate: { type: Number, required: true },
});

// Định nghĩa schema cho seat
const seatSchema = new mongoose.Schema(
  {
    seat_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true, // tự động tạo giá trị cho seat_id
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room", // Liên kết với model Room
    },
    seat_location: { type: String, required: true }, // Ví dụ: "A1", "B2", v.v.
    seat_type: seatTypeSchema, // Tham chiếu đến schema seatType
  },
  { timestamps: true } // Tạo tự động các trường createdAt và updatedAt
);

// Tạo model từ schema
const Seat = mongoose.model("Seat", seatSchema);

module.exports = Seat;
