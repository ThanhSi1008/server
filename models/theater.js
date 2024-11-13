const mongoose = require("mongoose");

// Định nghĩa schema cho địa chỉ
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
});

// Định nghĩa schema cho theater
const theaterSchema = new mongoose.Schema(
  {
    theater_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    theater_name: { type: String, required: true },
    address: addressSchema, // Địa chỉ sử dụng addressSchema
  },
  { timestamps: true }
); // Tự động tạo các trường createdAt và updatedAt

// Tạo model từ schema
const Theater = mongoose.model("Theater", theaterSchema);

module.exports = Theater;
