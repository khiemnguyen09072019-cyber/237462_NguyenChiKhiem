
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    gender: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    hireDate: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: "Đang làm việc"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
