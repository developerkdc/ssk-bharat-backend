import mongoose from "mongoose";
import userAndApprovals from "../../../utils/approval.schema";

const UnitSchema = new mongoose.Schema({
  unit_name: {
    type: String,
    min: 2,
    max: 25,
    required: [true, "Unit Name is required"],
    unique: true,
  },
  unit_symbol: {
    type: String,
    unique: true,
    required: [true, "Unit is required"],
  },
  approver: userAndApprovals,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const unitModel = mongoose.model("units", UnitSchema);
export default unitModel;
