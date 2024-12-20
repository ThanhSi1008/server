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

router.post("/:movieId/reviews", protect, async (req, res) => {
  const { movieId } = req.params;
  const { rating, reviewText } = req.body;

  if (!rating || !reviewText) {
    return res
      .status(400)
      .json({ error: "Rating and review text are required" });
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-indexed month
  const currentYear = currentDate.getFullYear();

  const newReview = {
    user_id: req.user._id,
    rating: rating,
    comment: reviewText,
    time: currentDate,
  };

  try {
    // Verify if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Check if a review document exists for the current month/year
    let reviewDoc = await Review.findOne({
      movie_id: new mongoose.Types.ObjectId(movieId),
      "date.month": currentMonth,
      "date.year": currentYear,
    });

    if (reviewDoc) {
      // Add the new review to the existing document
      reviewDoc.reviews.push(newReview);
      await reviewDoc.save();
      return res.status(200).json({ success: true, review: newReview });
    } else {
      // Create a new review document if none exists
      const newReviewDoc = new Review({
        movie_id: new mongoose.Types.ObjectId(movieId),
        date: { month: currentMonth, year: currentYear },
        reviews: [newReview],
      });
      await newReviewDoc.save();
      return res.status(201).json({ success: true, review: newReview });
    }
  } catch (err) {
    console.error("Error saving review:", err);
    return res
      .status(500)
      .json({ error: "Failed to save review", message: err.message });
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
    const movie = await Movie.findById(movieId);
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

    // Reverse the reviews array to display the most recent first
    const reversedReviews = reviews.reviews.reverse();

    res.json({
      movie_name: movie.movie_name,
      reviews: reversedReviews.map((review) => {
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
