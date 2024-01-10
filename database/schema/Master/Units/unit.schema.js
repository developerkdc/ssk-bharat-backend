import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../../utils/Logs.schema";
import createdBy from "../../../utils/createdBy.schema";

const UnitSchema = SchemaFunction(
  new mongoose.Schema({
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

UnitSchema.index({ "current_data.unit_name": 1 }, { unique: true });
UnitSchema.index({ "current_data.unit_symbol": 1 }, { unique: true });

const unitModel = mongoose.model("units", UnitSchema);
LogSchemaFunction("units", unitModel);

export default unitModel;
