const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Thay <db_password> với mật khẩu MongoDB của bạn
        const uri = "mongodb+srv://xishnaht108:123@cluster0.x9a9x.mongodb.net/cinema?retryWrites=true&w=majority&appName=Cluster0";

        // Kết nối MongoDB mà không cần các tùy chọn deprecated
        await mongoose.connect(uri);

        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);  // Dừng chương trình nếu không kết nối được
    }
};

module.exports = connectDB;
