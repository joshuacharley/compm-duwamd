import mongoose from "mongoose";

const PipelineProjectSchema = new mongoose.Schema(
  {
    projectId: { type: Number, unique: true, required: true },
    customerName: { type: String, required: true },
    service: { type: String, required: true },
    numberOfLinks: { type: String, required: true },
    bandwidth: { type: String, required: true },
    contractTerms: { type: String, required: true },
    oneOffCost: { type: String, required: true },
    monthlyCost: { type: String, required: true },
    dealWorth: { type: String, required: true },
    responsibility: { type: String, required: true },
    department: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "Ongoing", "Closed"],
      required: true,
    },
    comments: { type: String },
    requestDate: { type: Date, required: true },
    expectedClosureDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.PipelineProject ||
  mongoose.model("PipelineProject", PipelineProjectSchema);
