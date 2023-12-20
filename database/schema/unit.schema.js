import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema({
  unit_name: {
    type: String,
    min: 2,
    max: 25,
    required: [true, "Unit Name is required"],
    unique: true,
  },
  unit_symbol: {
    type: String,
    unique:true,
    required: [true, "Unit is required"],
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

const unitModel = mongoose.model("units", UnitSchema);
export default unitModel;
