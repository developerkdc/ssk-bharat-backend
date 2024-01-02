import mongoose from "mongoose";
import ApiError from "../../../../Utils/ApiError";
import userAndApprovals from "../../../utils/approval.schema";

const BranchSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "supplier id is requiured"],
  },
  branch_name: {
    type: String,
    trim: true,
    required: [true, "branch name is required"],
  },
  branch_onboarding_date: {
    type: Date,
    default: Date.now,
  },
  branch_status: {
    type: Boolean,
    default: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  kyc: {
    type: {
      kyc_status: Boolean,
      pan: {
        type: {
          pan_no: {
            type: String,
            trim: true,
            required: [true, "pan no is required"],
          },
          pan_image: {
            type: String,
            default: null,
          },
        },
      },
      gst: {
        type: {
          gst_no: {
            type: String,
            trim: true,
            required: [true, "gst no is required"],
          },
          gst_image: {
            type: String,
            default: null,
          },
        },
      },
      bank_details: {
        type: {
          bank_name: {
            type: String,
            trim: true,
            required: [true, "bank name is required"],
          },
          account_no: {
            type: String,
            trim: true,
            required: [true, "account no is required"],
          },
          confirm_account_no: {
            type: String,
            trim: true,
            validate: {
              validator: function (value) {
                return value === this.account_no;
              },
              message: "confirm account is not matched",
            },
            required: [true, "confirm account no is required"],
          },
          ifsc_code: {
            type: String,
            trim: true,
            required: [true, "ifsc code is required"],
          },
          passbook_image: {
            type: String,
            default: null,
          },
        },
      },
    },
  },
  branch_address: {
    address: {
      type: String,
      trim: true,
      required: [true, "address is required"],
    },
    location: {
      type: String,
      trim: true,
      required: [true, "location is required"],
    },
    area: {
      type: String,
      trim: true,
      required: [true, "area is required"],
    },
    district: {
      type: String,
      trim: true,
      required: [true, "district is required"],
    },
    taluka: {
      type: String,
      trim: true,
      required: [true, "taluka is required"],
    },
    state: {
      type: String,
      trim: true,
      required: [true, "state is required"],
    },
    city: {
      type: String,
      trim: true,
      required: [true, "city is required"],
    },
    country: {
      type: String,
      trim: true,
      required: [true, "country is required"],
    },
    pincode: {
      type: String,
      trim: true,
      required: [true, "pincode is required"],
    },
  },
  contact_person: [
    {
      first_name: {
        type: String,
        trim: true,
        required: [true, "first name is required"],
      },
      last_name: {
        type: String,
        trim: true,
        required: [true, "last name is required"],
      },
      role: {
        type: String,
        trim: true,
      },
      primary_email: {
        type: String,
        trim: true,
        validate: {
          validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: "primary invalid email Id",
        },
        required: [true, "primary email is required"],
      },
      secondary_email: {
        type: String,
        trim: true,
        validate: {
          validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: "secondary invalid email Id",
        },
      },
      primary_mobile: {
        type: String,
        trim: true,
        required: [true, "primary_mobile Number is required"],
      },
      secondary_mobile: {
        type: String,
        trim: true,
      },
      isPrimary: {
        type: Boolean,
        default: false,
      },
    },
  ],
  approver: userAndApprovals,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

BranchSchema.pre("save", function (next) {
  if (this.contact_person.length <= 0) {
    return next(
      new ApiError("Atleast one contact details should be provide", 400)
    );
  }
  next();
});

const supplierBranchModel = mongoose.model("supplierBranch", BranchSchema);

export default supplierBranchModel;
