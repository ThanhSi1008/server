const mongoose = require("mongoose");

// Định nghĩa schema cho product
const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    available: { type: Boolean, required: true }, // Trạng thái có sẵn hay không
    volume: { type: Number, required: true }, // Số lượng
    size: { type: String, required: true }, // Kích thước
    category: { type: String, required: true }, // Danh mục sản phẩm
    flavor: { type: String, required: true }, // Hương vị
    items: [{ type: mongoose.Schema.Types.Mixed }], // Mảng chứa các phần tử linh hoạt
  },
  { timestamps: true }
); // Tự động tạo các trường createdAt và updatedAt

// Tạo model từ schema
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
