import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  employee_id: { type: String, min: 2, max: 25, indexedDB: true },
  first_name: { type: String, min: 2, max: 25, required: true },
  last_name: { type: String, min: 2, max: 25, required: true },
  primary_email_id: {
    type: String,
    min: 5,
    max: 50,
    required: [true, "Email ID Required"],
  },
  secondary_email_id: { type: String, min: 5, max: 50 },
  password: { type: String, required: true },
  primary_mobile_no: { type: Number, min: 10, max: 10 },
  secondary_mobile_no: { type: Number, min: 10, max: 10 },
  profile_pic: { type: String, max: 150, default: null },
  status: { type: Boolean, default: true },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "RoleModel",
  },
  address: {
    type: {
      address: { type: String, max: 150 },
      location: { type: String, max: 150 },
      area: { type: String, max: 150 },
      city: { type: String },
      taluka: { type: String },
      district: { type: String },
      state: { type: String },
      country: { type: String },
      pincode: { type: Number, min: 6, max: 6 },
    },
  },
  kyc: {
    type: {
      pan_card_detail: {
        pan_no: { type: String, min: 16, max: 16 },
        pan_image: { type: String, max: 150, default: null },
      },
      aadhar_card_detail: {
        aadhar_no: { type: String, min: 16, max: 16 },
        aadhar_image: { type: String, max: 150, default: null },
      },
      bank_details: {
        type: {
          bank_name: { type: String },
          account_no: { type: String },
          confirm_account_no: {
            type: String,
            validate: {
              validator: function (value) {
                return value === this.type.account_no;
              },
              message: "Confirm Account Number must be the same as Account Number.",
            },
          },
          ifsc_code: { type: String },
          passbook_image: { type: String, max: 150, default: null },
        },
      },
    },
  },
  approver_one: {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserModel",
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
        ref: "UserModel",
      },
      employee_id: { type: String },
      name: { type: String },
      email_id: { type: String },
    },
    default: null,
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
  deleted_at: { type: Date, default: null },
});


export default mongoose.model("UserModel", UserSchema, "users");
