const mongoose = require("mongoose");

// Define schema for the cast
const castSchema = new mongoose.Schema({
  person_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  person_name: { type: String, required: true },
  avatar: { type: String, required: true },
  character_name: { type: String, required: true },
});

// Define schema for the reviews
const reviewsSchema = new mongoose.Schema({
  avg_rating: { type: Number, required: true },
  number_of_ratings: { type: Number, required: true },
});

// Define schema for the movie
const movieSchema = new mongoose.Schema(
  {
    movie_name: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    description: { type: String, required: true },
    genre: { type: String, required: true },
    language: { type: String, required: true },
    trailer_link: { type: String, required: true },
    release_date: { type: Date, required: true },
    movie_poster: { type: String, required: true }, // URL to poster image
    casts: [castSchema], // List of cast members
    rating: { reviewsSchema },
  },
  { timestamps: true } // Automatically create createdAt and updatedAt fields
);

// Create the Movie model from the schema
const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
