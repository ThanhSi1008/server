const mongoose = require("mongoose");

// Định nghĩa schema cho seat_type
const seatTypeSchema = new mongoose.Schema({
  seat_type_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  seat_type_name: { type: String, required: true },
});

// Định nghĩa schema cho seat
const seatSchema = new mongoose.Schema({
  seat_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  seat_location: { type: String, required: true },
  seat_type: { type: seatTypeSchema, required: true },
});

// Định nghĩa schema cho product
const productSchema = new mongoose.Schema({
  product: {
    product_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  quantity: { type: Number, required: true },
});

// Định nghĩa schema cho user
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: true },
});

// Định nghĩa schema cho order
const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    order_date: { type: Date, required: true, default: Date.now }, // Đặt mặc định là thời gian hiện tại
    total: { type: Number, required: true },
    seats: [seatSchema], // Mảng các ghế đã đặt
    screening_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Screening", // Liên kết với collection Screening
    },
    products: [productSchema], // Mảng các sản phẩm được mua
    user_id: userSchema, // Thông tin người dùng
  },
  { timestamps: true } // Tạo tự động các trường createdAt và updatedAt
);

// Tạo model từ schema
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
