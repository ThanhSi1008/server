const express = require("express")
const Movie = require("../models/movie")
const Review = require("../models/reviews")
const User = require("../models/user")
const mongoose = require("mongoose")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const movies = await Movie.find() // Truy vấn tất cả phim trong database
    res.json(movies) // Trả về danh sách phim dưới dạng JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id) // Thay đổi tùy theo cách lấy dữ liệu của bạn
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    res.json(movie)
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/reviews", protect, async (req, res) => {
  try {
    const movieId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID format" });
    }

    // Find the movie by ID
    const movie = await Movie.findById(movieId)
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const reviews = await Review.findOne({ movie_id: movieId }).populate({
      path: "reviews.user_id",
      model: "User",
      select: "full_name phone_number email dob account.user_name",
    });

    if (!reviews || !reviews.reviews.length) {
      return res.json({
        movie_name: movie.movie_name,
        reviews: [],
      });
    }

    res.json({
      movie_name: movie.movie_name,
      reviews: reviews.reviews.map((review) => {
        // Check if user_id exists before accessing its fields
        const user = review.user_id
          ? {
              id: review.user_id._id,
              full_name: review.user_id.full_name,
              phone_number: review.user_id.phone_number,
              email: review.user_id.email,
              dob: review.user_id.dob,
              user_name: review.user_id.account.user_name,
            }
          : null;

        return {
          user,
          rating: review.rating,
          comment: review.comment,
          time: review.time,
        };
      }),
    });
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
