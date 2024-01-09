import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../../utils/Logs.schema";

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
    created_by: {
      type: {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "user id is required"],
        },
        name: {
          type: String,
          trim: true,
          default: null,
        },
        email_id: {
          type: String,
          trim: true,
          validate: {
            validator: function (value) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "invalid email Id",
          },
        },
        employee_id: {
          type: String,
          trim: true,
          required: [true, "employee id is required"],
        },
      },
      required: [true, "created by is required"],
    },
  })
);

UnitSchema.index({ "current_data.unit_name": 1 }, { unique: true });
UnitSchema.index({ "current_data.unit_symbol": 1 }, { unique: true });

const unitModel = mongoose.model("units", UnitSchema);
LogSchemaFunction("units", unitModel);

export default unitModel;
