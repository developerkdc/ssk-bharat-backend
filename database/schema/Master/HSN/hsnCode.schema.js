import mongoose from "mongoose";
import userAndApprovals from "../../../utils/approval.schema";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../../utils/Logs.schema";
import createdBy from "../../../utils/createdBy.schema";

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
    isActive: {
      type: Boolean,
      default: true,
    },
    created_by:{
      type:createdBy,
      required:[true,"created by is required"]
    }
  })
);

const hsnCodeModel = mongoose.model("hsncode", HSNSchema);
LogSchemaFunction("hsncode",hsnCodeModel)
export default hsnCodeModel;
