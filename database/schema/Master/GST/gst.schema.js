import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../../utils/Logs.schema";
import createdBy from "../../../utils/createdBy.schema";

const GstSchema = SchemaFunction(
  new mongoose.Schema({
    gst_percentage: {
      type: Number,
      required: [true, "GST Percentage is required"],
      unique: true,
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

GstSchema.index({ "current_data.gst_percentage": 1 }, { unique: true });

const gstModel = mongoose.model("gst", GstSchema);
LogSchemaFunction("gst", gstModel);
export default gstModel;
