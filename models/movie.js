const mongoose = require("mongoose");

// Định nghĩa schema cho movie
const castSchema = new mongoose.Schema({
  person_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  person_name: { type: String, required: true },
  avatar: { type: String, required: true },
  character_name: { type: String, required: true },
});

const movieSchema = new mongoose.Schema(
  {
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    movie_name: { type: String, required: true },
    duration: { type: Number, required: true }, // thời gian, tính bằng phút
    description: { type: String, required: true },
    genre: { type: String, required: true },
    language: { type: String, required: true },
    trailer_link: { type: String, required: true },
    release_date: { type: Date, required: true },
    movie_poster: { type: String, required: true }, // link tới ảnh poster
    casts: [castSchema], // Danh sách các diễn viên
  },
  { timestamps: true }
); // Tự động tạo các trường createdAt và updatedAt

// Tạo model từ schema
const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
