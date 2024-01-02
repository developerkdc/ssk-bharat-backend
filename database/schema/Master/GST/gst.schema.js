import mongoose from "mongoose";
import userAndApprovals from "../../../utils/approval.schema";


const gstSchema = new mongoose.Schema({
  gst_percentage: {
    type: Number,
    required: [true, "GST Percentage is required"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: false
  }
})


const GstSchema = new mongoose.Schema({
  current_data: {
    type: gstSchema,
    required: true
  },
  proposed_changes: {
    type: gstSchema,
    default:function(){ return this.current_data}
  },
  approver: userAndApprovals,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const gstModel = mongoose.model("gst", GstSchema);
export default gstModel;
