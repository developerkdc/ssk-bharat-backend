import mongoose from "mongoose";
import addressSchema from "../utils/address.schema";
import userAndApprovals from "../utils/approval.schema";

const purchaseOrderSchema = new mongoose.Schema({
  purchase_order_no: {
    type: Number,
    required: [true, "Purchase Order No is required"],
    trim: true,
    unique: true,
  },
  purchase_order_date: {
    type: Date,
    required: [true, "Purchase Order Date is required"],
    trim: true,
  },
  estimate_delivery_date: {
    type: Date,
    required: [true, "Purchase Estimate Date is required"],
    trim: true,
  },

  supplier_details: {
    company_name: {
      type: String,
      // required: [true, "Company Name is required"],
      trim: true,
    },
    gst_no: {
      type: String,
      required: [true, "Gst No is required"],
      trim: true,
    },
    first_name: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
    },
    primary_email_id: {
      type: String,
      required: [true, "Primary Email Id is required"],
      trim: true,
    },
    secondary_email_id: { type: String, default: null },
    primary_mobile_no: {
      type: String,
      required: [true, "Primary Mobile Number is required"],
      trim: true,
    },
    secondary_mobile_no: { type: String, default: null },
    address: addressSchema,
  },
  ssk_details: {
    bill_to: {
      company_name: {
        type: String,
        required: [true, "Company Name is required"],
        trim: true,
      },
      gst_no: {
        type: String,
        required: [true, "Gst No is required"],
        trim: true,
      },
      first_name: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
      },
      last_name: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
      },
      primary_email_id: {
        type: String,
        required: [true, "Primary Email Id is required"],
        trim: true,
      },
      secondary_email_id: { type: String, default: null },
      primary_mobile_no: {
        type: String,
        required: [true, "Primary Mobile Number is required"],
        trim: true,
      },
      secondary_mobile_no: { type: String, default: null },
      address: addressSchema,
    },
    ship_to: {
      company_name: {
        type: String,
        required: [true, "Company Name is required"],
        trim: true,
      },
      gst_no: {
        type: String,
        required: [true, "Gst No is required"],
        trim: true,
      },
      first_name: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
      },
      last_name: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
      },
      primary_email_id: {
        type: String,
        required: [true, "Primary Email Id is required"],
        trim: true,
      },
      secondary_email_id: { type: String, default: null },
      primary_mobile_no: {
        type: String,
        required: [true, "Primary Mobile No is required"],
        trim: true,
      },
      secondary_mobile_no: { type: String, default: null },
      address: addressSchema,
    },
  },

  Items: [
    {
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
      cgst: { type: Number, default: 0 },
      sgst: { type: Number, default: 0 },
      igst: { type: Number, default: 0 },
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
  cgst: { type: Number, trim: true },
  sgst: { type: Number, trim: true },
  igst: { type: Number, trim: true },
  total_amount: {
    type: Number,
    required: [true, "Total Amount is required"],
    trim: true,
  },
  approver: userAndApprovals,
  status: {
    type: String,
    enum: ["Active", "Cancelled", "Closed"],
    default: "Active",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const sskPOModel = mongoose.model("SSKPurchaseOrder", purchaseOrderSchema);
export default sskPOModel;
