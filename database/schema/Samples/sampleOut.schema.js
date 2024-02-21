import mongoose from "mongoose";
import userAndApprovals from "../../utils/approval.schema";
import LogSchemaFunction from "../../utils/Logs.schema";

const sampleOutward = new mongoose.Schema({
  deliveryChallanNo: { type: String, trim: true, required: true },
  dateofsample:{type:String, trim: true},
  items: [
    {
      product_Id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: "products",
        required: true,
      },
      category: {
        type: String,
        required: [true, "Category is Required"],
      },
      product_name: {
        type: String,
        min: 2,
        max: 25,
        required: [true, "Product Name is required"],
        unique: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      sku: {
        type: String,
        min: 2,
        max: 25,
        required: [true, "SKU Code is required"],
        unique: true,
      },
      product_images: {
        type: Array,
        required: [true, "Product Image is required"],
      },
      short_description: {
        type: String,
        required: [true, "Short Description is required"],

        maxlength: 100,
      },
      long_description: {
        type: String,
        required: [true, "Long Description is required"],

        maxlength: 500,
      },
      hsn_code: {
        type: String,
        required: [true, "Hsn Code is required"],
      },
      show_in_website: { type: Boolean, default: false },
      show_in_retailer: { type: Boolean, default: false },
      show_in_offline_store: { type: Boolean, default: false },
      prices: {
        retailer_sales_price: {
          type: Number,
          default: 0,
        },
        website_sales_price: {
          type: Number,
          default: 0,
        },
        offline_store_sales_price: {
          type: Number,
          default: 0,
        },
      },
      mrp: {
        type: Number,
        default: 0,
        required: [true, "MRP is required"],
      },
      item_weight: {
        type: Number,
        default: 0,
        required: [true, "Item Weight is required"],
      },
      unit: {
        type: String,
        required: [true, "Unit is Required"],
      },
      quantity: { type: Number },
      gstpercentage:{type:Number},
    },
  ],
  contactDetails: {
    personName: { type: String },
    email: { type: String },
    mobileNo: { type: String },
    companyName: { type: String },
    gstNo: { type: String },
  },
  address: {
    address: { type: String },
    location: { type: String },
    area: { type: String },
    city: { type: String },
    taluka: { type: String },
    district: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
  },

  approver: userAndApprovals,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const sampleOut = mongoose.model("SampleOutward", sampleOutward);
LogSchemaFunction("sampleoutward", sampleOut)
export default sampleOut;
