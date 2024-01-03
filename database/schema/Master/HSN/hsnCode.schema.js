import mongoose from "mongoose";
import userAndApprovals from "../../../utils/approval.schema";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";

const HSNSchema = SchemaFunction(
  new mongoose.Schema({
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
  })
);

const hsnCodeModel = mongoose.model("hsncode", HSNSchema);
export default hsnCodeModel;
