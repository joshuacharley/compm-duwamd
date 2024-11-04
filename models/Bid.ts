import mongoose from "mongoose";

const BidSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    service: { type: String, required: true },
    deadline: { type: Date, required: true },
    biddingType: { type: String, required: true },
    keyRequirements: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Bid || mongoose.model("Bid", BidSchema);
