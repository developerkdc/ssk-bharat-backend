import mongoose from "mongoose";

const GstSchema = new mongoose.Schema({
  gst_percentage: {
    type: Number,
    required: [true, "GST Percentage is required"],
    unique: true,
  },
  approver_one: {
    type: {
      user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
      },
      name: {
        type:String,
        trim:true,
      },
      email_id: {
        type: String,
        validate: {
          validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          },
          message: "approver one invalid email Id"
        }
      },
      employee_id: String,
      isApprove:{
        type:Boolean,
        default:false
      }
    },
    default: null,
  },
  approver_two: {
    type: {
      user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
      },
      name: String,
      email_id: {
        type: String,
        validate: {
          validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          },
          message: "approver two invalid email Id"
        }
      },
      employee_id: String,
      isApprove:{
        type:Boolean,
        default:false
      }
    },
    default: null,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const gstModel = mongoose.model("gst", GstSchema);
export default gstModel;
