const express = require("express");
const User = require("../models/user"); // Import model user
const jwt = require("jsonwebtoken"); // Import thư viện jwt
require("dotenv").config();
const router = express.Router();

// Middleware để xác thực token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Xác thực token
    req.user = decoded; // Lưu thông tin user đã được giải mã từ token
    next(); // Tiếp tục xử lý request
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Route để lấy thông tin tài khoản người dùng đang đăng nhập
router.get("/me", authenticateToken, async (req, res) => {
  try {
    // Tìm người dùng từ decoded thông tin trong token
    const user = await User.findOne({ user_id: req.user.user_id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về thông tin người dùng
    res.json({
      user_id: user.user_id,
      full_name: user.full_name,
      phone_number: user.phone_number,
      email: user.email,
      dob: user.dob,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/auth", async (req, res) => {
  const { user_name, password } = req.body;

  try {
    // Tìm người dùng dựa trên tên người dùng
    const user = await User.findOne({ "account.user_name": user_name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra mật khẩu
    if (user.account.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Tạo JWT token với secret key từ biến môi trường
    const token = jwt.sign(
      { user_id: user.user_id, user_name: user.account.user_name },
      process.env.JWT_SECRET, // Sử dụng secret từ biến môi trường
      { expiresIn: "1h" } // Token hết hạn sau 1 giờ
    );

    // Trả về thông tin người dùng và token
    res.json({
      message: "Login successful",
      token, // Trả về token
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        phone_number: user.phone_number,
        email: user.email,
        dob: user.dob,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = router;
