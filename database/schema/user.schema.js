import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  employee_id: { type: Number, min: 1, max: 25, indexedDB: true, trim: true },
  first_name: { type: String, min: 2, max: 25, required: true, trim: true },
  last_name: { type: String, min: 2, max: 25, required: true, trim: true },
  primary_email_id: {
    type: String,
    min: 5,
    max: 50,
    required: [true, "Email ID Required"],
    trim: true,
  },
  secondary_email_id: { type: String, min: 5, max: 50, trim: true },
  password: { type: String, required: true, trim: true },
  primary_mobile_no: { type: Number, min: 10, max: 10, trim: true },
  secondary_mobile_no: { type: Number, min: 10, max: 10, trim: true },
  profile_pic: { type: String, max: 150, default: null },
  status: { type: Boolean, default: true },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "RoleModel",
  },
  address: {
    type: {
      address: { type: String, max: 150, trim: true },
      location: { type: String, max: 150, trim: true },
      area: { type: String, max: 150, trim: true },
      city: { type: String, trim: true },
      taluka: { type: String, trim: true },
      district: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: Number, min: 6, max: 6, trim: true },
    },
  },
  kyc: {
    type: {
      pan_card_detail: {
        pan_no: { type: String, min: 16, max: 16, trim: true },
        pan_image: { type: String, max: 150, default: null },
      },
      aadhar_card_detail: {
        aadhar_no: { type: String, min: 16, max: 16, trim: true },
        aadhar_image: { type: String, max: 150, default: null },
      },
      bank_details: {
        type: {
          bank_name: { type: String, trim: true },
          account_no: { type: String, trim: true },
          confirm_account_no: {
            type: String,
            trim: true,
            validate: {
              validator: function (value) {
                return value === this.type.account_no;
              },
              message:
                "Confirm Account Number must be the same as Account Number.",
            },
          },
          ifsc_code: { type: String, trim: true },
          passbook_image: { type: String, max: 150, default: null },
        },
      },
    },
  },
  approver_one: {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    employee_id: { type: String, required: true },
    name: { type: String, required: true },
    email_id: { type: String, required: true },
  },
  approver_two: {
    type: {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
      },
      employee_id: { type: String },
      name: { type: String, trim: true },
      email_id: { type: String },
    },
    default: null,
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted_at: { type: Date, default: null },
});

const userModel = mongoose.model("Users", UserSchema);
export default userModel;
