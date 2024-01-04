import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";

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
  })
);

UnitSchema.index({ "current_data.unit_name": 1 }, { unique: true });
UnitSchema.index({ "current_data.unit_symbol": 1 }, { unique: true });

const unitModel = mongoose.model("units", UnitSchema);
export default unitModel;
