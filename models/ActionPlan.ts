import mongoose from "mongoose";

const ActionPlanSchema = new mongoose.Schema(
  {
    service: { type: String, required: true },
    description: { type: String, required: true },
    actions: { type: String, required: true },
    owner: { type: String, required: true },
    dependency: { type: String },
    department: { type: String, required: true },
    deadline: { type: Date, required: true },
    actualCompletionDate: { type: Date },
    status: {
      type: String,
      enum: ["Open", "Ongoing", "Closed"],
      default: "Open",
      required: true,
    },
    comments: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ActionPlan ||
  mongoose.model("ActionPlan", ActionPlanSchema);
