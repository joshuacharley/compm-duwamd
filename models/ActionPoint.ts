import mongoose, { Document } from "mongoose";

export interface IActionPoint extends Document {
  topic: string;
  description: string;
  processingDate: Date;
  responsibility: string;
  expectedClosingDate: Date;
  status: "Pending" | "In Progress" | "Completed";
}

const ActionPointSchema = new mongoose.Schema<IActionPoint>(
  {
    topic: { type: String, required: true },
    description: { type: String, required: true },
    processingDate: { type: Date, required: true },
    responsibility: { type: String, required: true },
    expectedClosingDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ActionPoint ||
  mongoose.model<IActionPoint>("ActionPoint", ActionPointSchema);
