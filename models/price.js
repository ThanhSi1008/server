const mongoose = require("mongoose");

const priceDetailSchema = new mongoose.Schema({
  item: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Product", "Screening"],
    },
  },
  price: {
    type: Number,
    required: true,
  },
});

const priceSchema = new mongoose.Schema(
  {
    price_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    price_details: [priceDetailSchema],
  },
  { timestamps: true }
);

const Price = mongoose.model("Price", priceSchema);

module.exports = Price;
