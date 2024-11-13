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
    const movie = await Movie.findById(req.params.id); // Thay đổi tùy theo cách lấy dữ liệu của bạn
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ movie });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
