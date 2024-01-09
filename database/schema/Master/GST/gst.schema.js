import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../../utils/Logs.schema";

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

GstSchema.index({ "current_data.gst_percentage": 1 }, { unique: true });

const gstModel = mongoose.model("gst", GstSchema);
LogSchemaFunction("gst", gstModel);
export default gstModel;
