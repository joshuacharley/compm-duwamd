import mongoose from "mongoose";

const BidAlertSchema = new mongoose.Schema({
  source: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  bidCategory: {
    type: String,
    enum: ["Communication", "Connectivity", "Collaboration", "ICT"],
    required: true,
  },
  services: [String],
  publishDate: { type: Date, required: true },
  closingDate: Date,
  notified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Create a unique compound index
BidAlertSchema.index({ url: 1, title: 1 }, { unique: true });

export default mongoose.models.BidAlert ||
  mongoose.model("BidAlert", BidAlertSchema);
