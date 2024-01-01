import mongoose from "mongoose";
import userAndApprovals from "../../../utils/approval.schema";

const HSNSchema = new mongoose.Schema({
  hsn_code: {
    type: Number,
    required: [true, "HSN Code is required"],
    unique: true,
  },
  gst_percentage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "gst",
    required: [true, "GST Percentage is required"],
  },
  approver: userAndApprovals,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const hsnCodeModel = mongoose.model("hsncode", HSNSchema);
export default hsnCodeModel;
