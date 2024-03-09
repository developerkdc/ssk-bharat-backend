import mongoose from "mongoose";


const BillSchema = new mongoose.Schema({
  BillNo: { type: Number, trim: true, unique: true },
  name: { type: String, trim: true },
  email: { type: String, trim: true },
  address: {
    address: {
      type: String,
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      trim: true,
      lowercase: true,
    },
    area: {
      type: String,
      trim: true,
      lowercase: true,
    },
    district: {
      type: String,
      trim: true,
      lowercase: true,
    },
    taluka: {
      type: String,
      trim: true,
      lowercase: true,
    },
    state: {
      type: String,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      trim: true,
      lowercase: true,
    },
    country: {
      type: String,
      trim: true,
      lowercase: true,
      default: "india",
    },
    pincode: {
      type: String,
      trim: true,
    },
  },
  mobileNo: { type: String, trim: true },
  date: { type: Date, default: Date.now },
  RetailerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "retailers",
    required: true,
  },
  billfor: { type: String, enum: ["retailers", "offlinestores", "websites"] },
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
  total_amount: {
    type: Number,
    required: [true, "Total Amount is required"],
  },
  created_on: { type: Date, default: Date.now },
});


// const BillsModel = mongoose.model("Billing", Bills);
export default BillSchema;