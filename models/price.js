const mongoose = require("mongoose");

// Định nghĩa schema cho price_detail
const priceDetailSchema = new mongoose.Schema({
  item: {
    _id: {
      type: mongoose.Schema.Types.ObjectId, // Lưu ObjectId của Product hoặc Screening
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Product", "Screening"], // Giới hạn giá trị của type là Product hoặc Screening
    },
  },
  price: {
    type: Number,
    required: true,
  },
});

// Định nghĩa schema cho price
const priceSchema = new mongoose.Schema(
  {
    price_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true, // Tự động tạo giá trị cho price_id
    },
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    price_details: [priceDetailSchema], // Mảng các price_details
  },
  { timestamps: true } // Tạo tự động các trường createdAt và updatedAt
);

// Tạo model từ schema
const Price = mongoose.model("Price", priceSchema);

module.exports = Price;
