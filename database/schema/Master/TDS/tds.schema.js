import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";

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
  })
);

TdsSchema.index({ "current_data.tds_percentage": 1 }, { unique: true });

const tdsModel = mongoose.model("tds", TdsSchema);
export default tdsModel;
