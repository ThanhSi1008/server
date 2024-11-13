const mongoose = require("mongoose");

// Định nghĩa schema cho seat_type
const seatTypeSchema = new mongoose.Schema({
  seat_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  capacity: { type: Number, required: true },
  rate: { type: Number, required: true },
});

// Định nghĩa schema cho seat
const seatSchema = new mongoose.Schema({
  seat_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  seat_location: { type: String, required: true },
  seat_type: seatTypeSchema, // Tham chiếu đến seatType schema
  status: { type: Boolean, required: true }, // Tình trạng ghế (có thể là 'available' hoặc 'booked')
});

// Định nghĩa schema cho address
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postal_code: { type: String, required: true },
});

// Định nghĩa schema cho theater
const theaterSchema = new mongoose.Schema({
  theater_name: { type: String, required: true },
  address: addressSchema, // Định nghĩa lại schema cho address
});

// Định nghĩa schema cho room
const roomSchema = new mongoose.Schema({
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  room_name: { type: String, required: true },
  number_of_seats: { type: Number, required: true },
});

// Định nghĩa schema cho screening
const screeningSchema = new mongoose.Schema(
  {
    screening_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true, // Tự động tạo giá trị cho screening_id
    },
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Movie", // Liên kết với model Movie
    },
    screening_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    price_per_ticket: { type: Number, required: true },

    theater: theaterSchema, // Tham chiếu đến theater schema
    room: roomSchema, // Tham chiếu đến room schema
    seats: [seatSchema], // Danh sách các ghế trong buổi chiếu
  },
  { timestamps: true } // Tạo tự động các trường createdAt và updatedAt
);

// Tạo model từ schema
const Screening = mongoose.model("Screening", screeningSchema);

module.exports = Screening;
