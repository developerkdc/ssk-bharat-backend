import mongoose from "mongoose";
import addressSchema from "../utils/address.schema";
import userAndApprovals from "../utils/approval.schema";

const retailerPurchaseOrderSchema = new mongoose.Schema({
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

  ssk_details: {
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    supplier_name: {
      type: String,
      required: [true, "supplier name is required"],
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sskcompanybranches",
      required: true,
    },
    company_name: {
      type: String,
      // required: [true, "Company Name is required"],
      trim: true,
      default: null,
    },
    gst_no: {
      type: String,
      // required: [true, "Gst No is required"],
      trim: true,
      default: null,
    },
    first_name: {
      type: String,
      // required: [true, "First Name is required"],
      trim: true,

      default: null,
    },
    last_name: {
      type: String,
      // required: [true, "Last Name is required"],
      trim: true,
      default: null,
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

  retailer_details: {
    retailer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "retailers",
      required: [true, "Retailer Id is required"], //random  id pasing api is not created for store user
    },
    retailer_name: {
      type: String,
      required: [true, "Retailer name is required"],
    },
    bill_to: {
      branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "offlinestorebranches",
        required: true,
      },
      company_name: {
        type: String,
        // required: [true, "Company Name is required"],
        trim: true,
        default: null,
      },
      gst_no: {
        type: String,
        // required: [true, "Gst No is required"],
        trim: true,
        default: null,
      },
      first_name: {
        type: String,
        // required: [true, "First Name is required"],
        trim: true,
        default: null,
      },
      last_name: {
        type: String,
        // required: [true, "Last Name is required"],
        trim: true,
        default: null,
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
      branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "offlinestorebranches",
        required: true,
      },
      company_name: {
        type: String,
        // required: [true, "Company Name is required"],
        trim: true,
        default: null,
      },
      gst_no: {
        type: String,
        // required: [true, "Gst No is required"],
        trim: true,
        default: null,
      },
      first_name: {
        type: String,
        // required: [true, "First Name is required"],
        trim: true,
        default: null,
      },
      last_name: {
        type: String,
        // required: [true, "Last Name is required"],
        trim: true,
        default: null,
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
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: [true, "product Id is required"],
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
  approver: userAndApprovals,
  status: {
    type: String,
    enum: ["active", "cancelled", "closed"],
    default: "active",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const retailerPOModel = mongoose.model(
  "retailerpurchaseorder",
  retailerPurchaseOrderSchema
);
export default retailerPOModel;
