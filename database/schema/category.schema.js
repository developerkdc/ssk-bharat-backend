import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    min: 2,
    max: 25,
    required: [true, "Category Name is required"],
    unique: true,
  },
  category_image: {
    type: String,
    required: [true, "Image is required"],
  },
  status: { type: Boolean, default: true },
  show_in_website: { type: Boolean, default: false },
  show_in_retailer: { type: Boolean, default: false },
  show_in_offline_store: { type: Boolean, default: false },
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

const categoryModel = mongoose.model("category", CategorySchema);
export default categoryModel;
