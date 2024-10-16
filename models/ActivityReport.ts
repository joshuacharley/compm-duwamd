import mongoose from "mongoose";

const ActivityReportSchema = new mongoose.Schema(
  {
    informationSharing: [{ type: String }],
    workedWell: [{ type: String }],
    difficulties: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.ActivityReport ||
  mongoose.model("ActivityReport", ActivityReportSchema);
