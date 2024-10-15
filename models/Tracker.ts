import mongoose from 'mongoose';

const TrackerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['Weekly', 'Monthly', 'Custom'], required: true },
  progress: { type: Number, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Tracker || mongoose.model('Tracker', TrackerSchema);