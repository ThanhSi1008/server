const mongoose = require("mongoose");

// Định nghĩa schema cho attribute (các thuộc tính của phòng)
const attributeSchema = new mongoose.Schema({
  screen_type: { type: String, required: true },
  sound_system: { type: String, required: true },
  glasses_provided: { type: Boolean, required: true },
  product_services: { type: String, required: true },
});

// Định nghĩa schema cho room
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
      ref: "Theater", // Liên kết với bảng Theater
    },
    room_name: { type: String, required: true },
    capacity: { type: Number, required: true }, // Sức chứa của phòng
    attribute: [attributeSchema], // Mảng các thuộc tính của phòng
  },
  { timestamps: true }
); // Tự động tạo các trường createdAt và updatedAt

// Tạo model từ schema
const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
