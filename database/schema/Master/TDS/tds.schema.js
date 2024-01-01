import mongoose from "mongoose";
import userAndApprovals from "../../../utils/approval.schema";

const TdsSchema = new mongoose.Schema({
  tds_percentage: {
    type: Number,
    required: [true, "TDS Percentage is required"],
    unique: true,
  },
  approver:userAndApprovals,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const tdsModel = mongoose.model("tds", TdsSchema);
export default tdsModel;
