import mongoose from "mongoose";

const HSNSchema = new mongoose.Schema({
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
  approver_one: {
    type: {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      name: {
        type: String,
        trim: true,
      },
      email_id: {
        type: String,
        validate: {
          validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: "approver one invalid email Id",
        },
      },
      employee_id: String,
      isApprove: {
        type: Boolean,
        default: false,
      },
    },
    default: null,
  },
  approver_two: {
    type: {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      name: String,
      email_id: {
        type: String,
        validate: {
          validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: "approver two invalid email Id",
        },
      },
      employee_id: String,
      isApprove: {
        type: Boolean,
        default: false,
      },
    },
    default: null,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const hsnCodeModel = mongoose.model("HSN Code", HSNSchema);
export default hsnCodeModel;
