
const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// 1. Lấy danh sách nhân viên và tìm kiếm
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { employeeId: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } }
        ]
      };
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách nhân viên" });
  }
});

// 2. Lấy chi tiết một nhân viên
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin nhân viên" });
  }
});

// 3. Thêm nhân viên
router.post("/", async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({
      message: "Thêm nhân viên thành công",
      employee
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Mã nhân viên đã tồn tại" });
    }

    res.status(400).json({
      message: "Thêm nhân viên thất bại",
      error: error.message
    });
  }
});

// 4. Cập nhật nhân viên
router.put("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    res.json({
      message: "Cập nhật nhân viên thành công",
      employee
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Mã nhân viên đã tồn tại" });
    }

    res.status(400).json({
      message: "Cập nhật nhân viên thất bại",
      error: error.message
    });
  }
});

// 5. Xóa nhân viên
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    res.json({ message: "Xóa nhân viên thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa nhân viên" });
  }
});

module.exports = router;
