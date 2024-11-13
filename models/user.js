const mongoose = require("mongoose");

// Định nghĩa schema cho account
const accountSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  password: { type: String, required: true },
});

// Định nghĩa schema cho user
const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    full_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: Date, required: true }, // Ngày sinh, kiểu ISODate
    account: accountSchema, // Thông tin tài khoản
  },
  { timestamps: true }
); // Tự động tạo các trường createdAt và updatedAt

// Tạo model từ schema
const User = mongoose.model("User", userSchema);

module.exports = User;
