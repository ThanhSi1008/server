const mongoose = require("mongoose");

const seatTypeSchema = new mongoose.Schema({
  seat_type_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  seat_type_name: { type: String, required: true },
});

const seatSchema = new mongoose.Schema({
  seat_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  seat_location: { type: String, required: true },
  seat_type: { type: seatTypeSchema, required: true },
});

const productSchema = new mongoose.Schema({
  product: {
    product_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  quantity: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    order_date: { type: Date, required: true, default: Date.now },
    total: { type: Number, required: true },
    seats: [seatSchema],
    screening_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Screening",
    },
    products: [productSchema],
    user_id: userSchema,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
