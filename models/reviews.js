const mongoose = require("mongoose");

// Định nghĩa schema cho review
const reviewSchema = new mongoose.Schema(
  {
    review_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true, // Tự động tạo giá trị cho review_id
    },
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Movie", // Liên kết với model Movie
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
          ref: "User", // Liên kết với model User
        },
        rating: { type: Number, required: true }, // Đánh giá của người dùng
        comment: { type: String, required: true }, // Bình luận của người dùng
        time: { type: Date, required: true }, // Thời gian người dùng để lại đánh giá
      },
    ],
  },
  { timestamps: true } // Tạo tự động các trường createdAt và updatedAt
);

// Tạo model từ schema
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
