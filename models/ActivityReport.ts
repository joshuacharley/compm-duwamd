import mongoose from "mongoose";

const ActivityReportSchema = new mongoose.Schema(
  {
    informationSharing: [{ type: String }],
    workedWell: [{ type: String }],
    difficulties: [{ type: String }],
    alignmentRequest: [{ type: String }],
    week: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

export interface IActivityReport extends mongoose.Document {
  informationSharing: string[];
  workedWell: string[];
  difficulties: string[];
  alignmentRequest: string[];
  week: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.models.ActivityReport ||
  mongoose.model<IActivityReport>("ActivityReport", ActivityReportSchema);
