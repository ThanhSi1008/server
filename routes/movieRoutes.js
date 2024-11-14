const express = require("express");
const Movie = require("../models/movie"); // Import model movie
const router = express.Router();

// Route để lấy danh sách tất cả các phim
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find(); // Truy vấn tất cả phim trong database
    res.json(movies); // Trả về danh sách phim dưới dạng JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("req.params: " + req.params);
    const movie = await Movie.findOne({_id: req.params.id});
    console.log('movie at routes: ' + movie)
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ movie });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/reviews", async (req, res) => {
  try {
    const movieId = req.params.id;

    // Validate movie ID
    if (!ObjectId.isValid(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID format" });
    }

    // Find movie by ID
    const movie = await Movie.findOne({ _id: ObjectId(movieId) });
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Find reviews for the movie
    const reviews = await Review.find({ movie_id: ObjectId(movieId) });

    // Respond with movie info and its reviews
    res.json({
      movie_name: movie.movie_name,
      reviews: reviews.map((review) => ({
        review_id: review.review_id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment,
        time: review.time,
      })),
    });
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
