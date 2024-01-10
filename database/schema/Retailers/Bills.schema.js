import mongoose from "mongoose";


const BillSchema = new mongoose.Schema({
  BillNo: { type: Number, trim: true, unique: true },
  Name: { type: String, trim: true },
  Email: { type: String, trim: true },
  Address: { type: String, trim: true },
  MobileNo: { type: String, trim: true },
  Date: { type: Date, default: Date.now },
  RetailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "retailers",
    required: true,
  },
  Billfor: { type: String, enum: ["retailers", "offlinestores", "websites"] },
  Items: [
    {
      product_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      item_name: {
        type: String,
        required: [true, "Item Name is required"],
        trim: true,
      },
      category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
      },
      sku: { type: String, required: [true, "SKU is required"], trim: true },
      hsn_code: {
        type: String,
        required: [true, "HSN Code is required"],
        trim: true,
      },
      weight: {
        type: Number,
        required: [true, "Item Weight is required"],
        trim: true,
      },
      unit: { type: String, required: [true, "Unit is required"], trim: true },
      rate_per_unit: {
        type: Number,
        required: [true, "Rate per Unit is required"],
        trim: true,
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        trim: true,
      },
      item_amount: {
        type: Number,
        required: [true, "Item Amount is required"],
        trim: true,
      },
      gst: {
        cgst: {
          percentage: {
            type: Number,
            default: null,
          },
          cgst_value: {
            type: Number,
            default: null,
          },
        },
        sgst: {
          percentage: {
            type: Number,
            default: null,
          },
          sgst_value: {
            type: Number,
            default: null,
          },
        },
        igst: {
          percentage: {
            type: Number,
            default: null,
          },
          igst_value: {
            type: Number,
            default: null,
          },
        },
      },
      total_amount: {
        type: Number,
        required: [true, "Total Amount is required"],
        trim: true,
      },
    },
  ],
  total_weight: {
    type: Number,
    required: [true, "Total Weight is required"],
    trim: true,
  },
  total_quantity: {
    type: Number,
    required: [true, "Total Quantity is required"],
    trim: true,
  },
  total_item_amount: {
    type: Number,
    required: [true, "Total Item Amount is required"],
    trim: true,
  },
  total_gst: {
    type: Number,
    required: [true, "Total Gst is required"],
  },
  total_amount: {
    type: Number,
    required: [true, "Total Amount is required"],
  },
  created_at: { type: Date, default: Date.now },
});


// const BillsModel = mongoose.model("Billing", Bills);
export default BillSchema;