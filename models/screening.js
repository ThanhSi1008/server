const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seat_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  seat_location: { type: String, required: true },
  seat_type_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: Boolean, required: true },
});

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
});

const theaterSchema = new mongoose.Schema({
  theater_name: { type: String, required: true },
  address: addressSchema,
});

const roomSchema = new mongoose.Schema({
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  room_name: { type: String, required: true },
  number_of_seats: { type: Number, required: true },
});

const screeningSchema = new mongoose.Schema(
  {
    screening_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Movie",
    },
    screening_time: { type: Date, required: true },
    end_time: { type: Date, required: true },

    theater: theaterSchema,
    room: roomSchema,
    seats: [seatSchema],
  },
  { timestamps: true }
);

const Screening = mongoose.model("Screening", screeningSchema);

module.exports = Screening;
