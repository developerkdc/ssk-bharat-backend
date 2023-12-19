import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({
  company_name: {
    type: String,
    minlength: [2, "Length should be greater than two"],
    maxlength: [25, "Length should be less than or equal to 25"],
    trim: true,
    required: [true, "Company name is required"]
  },
  onboarding_date: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    trim: true,
    default: null
  },
  company_status: {
    type: Boolean,
    default: false
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
      email: {
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
  },
  approver_one: {
    type: {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
      },
      name: {
        type: String,
        trim: true,
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
      isApprove: {
        type: Boolean,
        default: false
      }
    },
    default: null,
  },
  approver_two: {
    type: {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
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
      isApprove: {
        type: Boolean,
        default: false
      }
    },
    default: null,
  },
})
const SupplierModel = mongoose.model("Supplier", SupplierSchema);

export default SupplierModel;
