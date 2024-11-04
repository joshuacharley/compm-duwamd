import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  deliverables: [String],
});

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    objective: { type: String, required: true },
    scope: { type: String, required: true },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed", "On Hold"],
      default: "Not Started",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    manager: { type: String, required: true },
    department: { type: String, required: true },
    stakeholders: [String],
    progress: { type: Number, default: 0 },
    milestones: [MilestoneSchema],
    risks: [
      {
        description: String,
        impact: { type: String, enum: ["Low", "Medium", "High"] },
        mitigation: String,
        status: { type: String, enum: ["Open", "Mitigated", "Closed"] },
      },
    ],
    files: [
      {
        name: String,
        url: String,
        type: String,
        uploadedBy: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    meetings: [
      {
        title: String,
        date: Date,
        attendees: [String],
        notes: String,
      },
    ],
    updates: [
      {
        content: String,
        author: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
