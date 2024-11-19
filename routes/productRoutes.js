const express = require("express");
const Product = require("../models/product"); // Import model Product
const router = express.Router();

// Route để lấy danh sách tất cả các sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Truy vấn tất cả sản phẩm trong database
    res.json(products); // Trả về danh sách sản phẩm dưới dạng JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route để lấy thông tin chi tiết của một sản phẩm
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Tìm sản phẩm theo ID
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product); // Trả về thông tin chi tiết của sản phẩm
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
