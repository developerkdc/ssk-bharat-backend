import mongoose from "mongoose";
import addressSchema from "../../utils/address.schema";
import userAndApprovals from "../../utils/approval.schema";
import SchemaFunction from "../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../utils/Logs.schema";

const salesOrder = SchemaFunction(
  new mongoose.Schema({
    order_no: {
      type: Number,
      required: [true, "Order No is required"],
      trim: true,
    },
    sales_order_no: {
      type: Number,
      required: [true, "Sales Order No is required"],
      trim: true,
      unique: true,
    },
    estimate_delivery_date: {
      type: Date,
      required: [true, "Order Estimate Date is required"],
      trim: true,
    },
    sales_order_date: {
      type: Date,
      required: [true, "Sales Order Date is required"],
    },
    order_date: {
      type: Date,
      required: [true, "Sales Order Date is required"],
      trim: true,
    },
    order_type: {
      type: String,
      required: [true, "Sales Order Type is required"],
      enum: ["retailers", "offlinestores", "websites"],
      trim: true,
    },
    refund_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"refunds",
      default:null,
    },
    ssk_details: {
      ssk_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sskcompanies",
        required: [true, "SSK Id is required"],
      },
      ssk_name: {
        type: String,
        ref: "sskcompanies",
        required: [true, "SSK Id is required"],
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
        //   required: [true, "Gst No is required"],
        trim: true,
        default: null,
      },
      first_name: {
        type: String,
        //   required: [true, "First Name is required"],
        trim: true,
        default: null,
      },
      last_name: {
        type: String,
        //   required: [true, "Last Name is required"],
        trim: true,
        default: null,
      },
      primary_email_id: {
        type: String,
        required: [true, "Primary Email Id is required"],
        trim: true,
        validate: {
          validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: "invalid email Id",
        },
      },
      secondary_email_id: {
        type: String,
        default: null,
      },
      primary_mobile_no: {
        type: String,
        required: [true, "Primary Mobile Number is required"],
        trim: true,
      },
      secondary_mobile_no: { type: String, default: null },
      address: addressSchema,
    },
    customer_details: {
      customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Customer Id is required"],
        refPath: "order_type",
      },
      customer_name: {
        type: String,
        required: [true, "Customer name is required"],
      },
      bill_to: {
        branch_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        branch_name: {
          type: String,
          // required: [true, "Name is required"],
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
          validate: {
            validator: function (value) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "invalid email Id",
          },
        },
        secondary_email_id: {
          type: String,
          default: null,
        },
        primary_mobile_no: {
          type: Number,
          required: [true, "Primary Mobile Number is required"],
          trim: true,
        },
        secondary_mobile_no: { type: Number, default: null },
        address: addressSchema,
      },
      ship_to: {
        branch_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        branch_name: {
          type: String,
          // required: [true, "Name is required"],
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
          validate: {
            validator: function (value) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "invalid email Id",
          },
        },
        secondary_email_id: {
          type: String,
          default: null,
        },
        primary_mobile_no: {
          type: Number,
          required: [true, "Primary Mobile No is required"],
          trim: true,
        },
        secondary_mobile_no: { type: Number, default: null },
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
        unit: {
          type: String,
          required: [true, "Unit is required"],
          trim: true,
        },
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
        dispatch_quantity: {
          type: Number,
          required: [true, "Dispatch Quantity is required"],
          trim: true,
        },
        balance_quantity: {
          type: Number,
          required: [true, "Balance Quantity is required"],
          trim: true,
        },
        item_amount: {
          type: Number,
          required: [true, "Item Amount is required"],
          trim: true,
        },
        gst: {
          cgst: {
            type: Number,
            default: 0,
          },
          sgst: {
            type: Number,
            default: 0,
          },
          igst: {
            type: Number,
            default: 0,
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
    total_igst: {
      type: Number,
      default: 0,
    },
    total_cgst: {
      type: Number,
      default: 0,
    },
    total_sgst: {
      type: Number,
      default: 0,
    },
    est_payment_days: {
      type: Number,
      default: null,
    },
  })
);

salesOrder.index({ "current_data.sales_order_no": 1 }, { unique: true });

const SalesModel = mongoose.model("salesorders", salesOrder);

LogSchemaFunction("salesorders", SalesModel);

export default SalesModel;
