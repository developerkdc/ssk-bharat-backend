import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../../utils/Logs.schema";
import createdBy from "../../../utils/createdBy.schema";

const TdsSchema = SchemaFunction(
  new mongoose.Schema({
    tds_percentage: {
      type: Number,
      required: [true, "TDS Percentage is required"],
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

TdsSchema.index({ "current_data.tds_percentage": 1 }, { unique: true });

const tdsModel = mongoose.model("tds", TdsSchema);
LogSchemaFunction("tds", tdsModel);

export default tdsModel;
