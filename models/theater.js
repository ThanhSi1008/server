const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
});

const theaterSchema = new mongoose.Schema(
  {
    theater_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    theater_name: { type: String, required: true },
    address: addressSchema,
    location_link: { type: String },
  },
  { timestamps: true }
);

const Theater = mongoose.model("Theater", theaterSchema);

module.exports = Theater;
