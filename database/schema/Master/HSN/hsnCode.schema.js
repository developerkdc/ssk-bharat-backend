import mongoose from "mongoose";
import userAndApprovals from "../../../utils/approval.schema";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../../utils/Logs.schema";

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
    created_by: {
      type: {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "user id is required"]
        },
        name: {
          type: String,
          trim: true,
          default: null
        },
        email_id: {
          type: String,
          trim: true,
          validate: {
            validator: function (value) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            message: "invalid email Id"
          }
        },
        employee_id: {
          type: String,
          trim: true,
          required: [true, "employee id is required"]
        },
      },
      required: [true, "created by is required"]
    }
  })
);

const hsnCodeModel = mongoose.model("hsncode", HSNSchema);
LogSchemaFunction("hsncode",hsnCodeModel)
export default hsnCodeModel;
