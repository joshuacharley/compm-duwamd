import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    status: { type: String, required: true },
    week: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);
