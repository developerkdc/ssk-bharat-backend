import mongoose from "mongoose";
import addressSchema from "../../utils/address.schema";
import SchemaFunction from "../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../utils/Logs.schema";
import createdBy from "../../utils/createdBy.schema";

const dispatchOrder = SchemaFunction(
  new mongoose.Schema({
    dispatch_no: {
      type: Number,
      required: [true, "Order No is required"],
      trim: true,
      unique: true,
    },
    sales_order_no: {
      type: Number,
      required: [true, "Sales Order No is required"],
      trim: true,
      unique: true,
    },
    sales_order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "salesorders",
      required: [true, "Sales Order ID is required"],
    },
    order_type: {
      type: String,
      required: [true, "Sales Order Type is required"],
      enum: ["retailers", "offlinestores", "websites"],
      trim: true,
    },
    delivery_status: {
      type: String,
      required: [true, "Sales Order Type is required"],
      enum: ["dispatched", "outForDelivery", "delivered"],
      trim: true,
    },
    tracking_date: {
      sales_order_date: {
        type: Date,
        required: [true, "Sales Order Date is required"],
      },
      dispatch_generated_date: {
        type: Date,
        default: Date.now,
      },
      out_for_delivery: {
        dispatch_date: {
          type: Date,

          default: null,
        },
        estimate_delivery_date: {
          type: Date,

          default: null,
        },
      },
      delivered: {
        type: Date,
        default: null,
      },
    },
    ssk_details: {
      ssk_id: {
        type: mongoose.Schema.Types.ObjectId,
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
        required: [true, "Company Name is required"],
        trim: true,
        default: null,
      },
      gst_no: {
        type: String,
        required: [true, "Gst No is required"],
        trim: true,
        default: null,
      },
      first_name: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
        default: null,
      },
      last_name: {
        type: String,
        required: [true, "Last Name is required"],
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
        trim: true,
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
        refPath: "current_data.order_type",
        required: [true, "Customer Id is required"],
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
        name: {
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
          trim: true,
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
        name: {
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
          trim: true,
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
        product_Id: {
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
    transport_details: {
      delivery_challan_no: {
        type: String,
        default: null,
      },
      transport_type: {
        type: String,
        enum: ["hand", "courier", "road", "rail", "air"],
        trim: true,
        default: null,
      },
      hand_delivery: {
        person_name: {
          type: String,
          trim: true,
          default: null,
        },
        person_phone_no: {
          type: Number,
          trim: true,
          default: null,
        },
      },
      courier: {
        company_name: {
          type: String,
          trim: true,
          default: null,
        },
        docket_no: {
          type: String,
          trim: true,
          default: null,
        },
      },
      road: {
        transporter_name: {
          type: String,
          trim: true,
          default: null,
        },
        vehicle_no: {
          type: String,
          trim: true,
          default: null,
        },
        driver_name: {
          type: String,
          trim: true,
          default: null,
        },
        driver_phone_no: {
          type: Number,
          trim: true,
          default: null,
        },
      },
      rail: {
        transporter_name: {
          type: String,
          trim: true,
          default: null,
        },
        awb_no: {
          type: String,
          trim: true,
          default: null,
        },
      },
      air: {
        transporter_name: {
          type: String,
          trim: true,
          default: null,
        },
        awb_no: {
          type: String,
          trim: true,
          default: null,
        },
      },
    },
    created_by:{
      type:createdBy,
      required:[true,"created by is required"]
    }
  })
);

dispatchOrder.index({ "current_data.sales_order_no": 1 }, { unique: true });
dispatchOrder.index({ "current_data.dispatch_no": 1 }, { unique: true });

const DispatchModel = mongoose.model("dispatchorders", dispatchOrder);
LogSchemaFunction("dispatchorders", DispatchModel);

export default DispatchModel;
