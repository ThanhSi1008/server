const express = require("express");
const Product = require("../models/product"); // Import model Product
const router = express.Router();

// Route để lấy danh sách tất cả các sản phẩm
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); // Truy vấn tất cả sản phẩm trong database
    res.json(products); // Trả về danh sách sản phẩm dưới dạng JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route để lấy thông tin chi tiết của một sản phẩm
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Tìm sản phẩm theo ID
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product); // Trả về thông tin chi tiết của sản phẩm
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// API route để thêm sản phẩm mới
router.post("/add-product", async (req, res) => {
  try {
    const { name, type, available, volume, size, category, flavor, items } =
      req.body;

    const newProduct = new Product({
      name,
      type,
      available,
      volume,
      size,
      category,
      flavor,
      items,
    });

    await newProduct.save(); // Lưu sản phẩm vào MongoDB

    res.status(201).json({
      message: "Product added successfully!",
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product", error: err });
  }
});

// API route để cập nhật thông tin sản phẩm
router.put("/update-product/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Trả về đối tượng sản phẩm sau khi cập nhật
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product", error: err });
  }
});

// API route để xóa một sản phẩm
router.delete("/delete-product/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product", error: err });
  }
});

module.exports = router;
