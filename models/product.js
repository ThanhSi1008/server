const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    available: { type: Boolean, required: true },
    volume: { type: Number },
    size: { type: String },
    calories: { type: String },
    flavor: { type: String },
    combo: [{ type: this }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
