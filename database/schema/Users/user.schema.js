import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import LogSchemaFunction from "../../utils/Logs.schema";
import SchemaFunction from "../../../controllers/HelperFunction/SchemaFunction";

const UserSchema = SchemaFunction(
  new mongoose.Schema({
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
    primary_mobile_no: {
      type: String,
      minLength: 10,
      maxLength: 13,
      unique: true,
      trim: true,
    },
    secondary_mobile_no: {
      type: String,
      minLength: 10,
      maxLength: 13,
      trim: true,
    },
    profile_pic: { type: String, max: 150, default: null },
    status: { type: Boolean, default: true },
    isActive: {
      type: Boolean,
      default: true,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "roles",
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
        pincode: { type: String, minLength: 6, trim: true },
      },
    },
    kyc: {
      type: {
        pan_card_detail: {
          pan_no: { type: String, min: 10, max: 16, trim: true },
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
                  return value === this.account_no;
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
    otp: { type: String, trim: true },
    isActive:{
      type:Boolean,
      default:true
    }
  })  
)
UserSchema.methods.jwtToken = function (next) {
  try {
    return jwt.sign(
      {
        userId: this._id,
        username: this.first_name,
        primaryEmailId: this.primary_email_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );
  } catch (error) {
    return next(error);
  }
};

UserSchema.index({ "current_data.primary_mobile_no": 1 }, { unique: true });


const userModel = mongoose.model("Users", UserSchema);

LogSchemaFunction("user",userModel);

export default userModel;
