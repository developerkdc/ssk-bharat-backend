import mongoose from "mongoose";
import userAndApprovals from "../../../utils/approval.schema";

const GstSchema = new mongoose.Schema({
  gst_percentage: {
    type: Number,
    required: [true, "GST Percentage is required"],
    unique: true,
  },
  approver:userAndApprovals,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const gstModel = mongoose.model("gst", GstSchema);
export default gstModel;
