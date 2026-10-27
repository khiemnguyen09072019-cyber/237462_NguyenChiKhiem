
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const employeeRoutes = require("./routes/employees");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kiểm tra backend

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend đang hoạt động",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// API nhân viên
app.use("/api/employees", employeeRoutes);

// Kết nối MongoDB và khởi động server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Đã kết nối MongoDB Atlas thành công");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server đang chạy tại cổng ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  });
