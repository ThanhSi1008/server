const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Movie",
    },
    date: {
      year: { type: Number, required: true },
      month: { type: Number, required: true },
    },
    reviews: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        time: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
