import mongoose from "mongoose";
import addressSchema from "../../utils/address.schema";

const ItemsSchema = new mongoose.Schema({
  product_Id: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    ref: "products",
  },
  itemName: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true },
  hsn_code: { type: String, required: true, trim: true },
  itemsWeight: { type: Number, required: true, trim: true },
  unit: { type: String, required: true, trim: true },
  ratePerUnit: { type: Number, required: true, trim: true },
  quantity: { type: Number, required: true, trim: true },
  itemAmount: { type: Number, required: true, trim: true },
  gstpercentage: { type: Number, required: true, trim: true },
  gstAmount: { type: Number, required: true, trim: true },
  totalAmount: { type: Number, required: true, trim: true },
  receivedQuantity: { type: Number, required: true, trim: true },
  availableQuantity: { type: Number, trim: true },
  balanceQuantity: { type: Number, trim: true },
  reservedQuantity: { type: Number, trim: true },
});

const TransportDetailsSchema = new mongoose.Schema({
  deliveryChallanNo: { type: String, trim: true, required: true },
  transportType: {
    handDelivery: {
      personName: { type: String, trim: true },
      personNumber: { type: String, trim: true },
    },
    courier: {
      companyName: { type: String, trim: true },
      docketNumber: { type: String, trim: true },
    },
    road: {
      transporterName: { type: String, trim: true },
      vehicleNumber: { type: String, trim: true },
      driverName: { type: String, trim: true },
      driverNumber: { type: String, trim: true },
    },
    airRail: {
      transporterName: { type: String, trim: true },
      airRail: { type: String, trim: true },
      awbNumber: { type: String, trim: true },
    },

    deliveryChallanNo_image: { type: String, default: null },
  },
});

const CustomerDetailsSchema = new mongoose.Schema({
  CustomerCompanyName: { type: String, trim: true },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
  },
  customer_name: { type: String, trim: true },
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
      default: null,
      trim: true,
      // validate: {
      //   validator: function (value) {
      //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      //   },
      //   message: "invalid email Id",
      // },
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
      // validate: {
      //   validator: function (value) {
      //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      //   },
      //   message: "invalid email Id",
      // },
    },
    primary_mobile_no: {
      type: Number,
      required: [true, "Primary Mobile No is required"],
      trim: true,
    },
    secondary_mobile_no: { type: Number, default: null },
    address: addressSchema,
  },
});

const InvoiceDetailsSchema = new mongoose.Schema({
  invoiceNo: { type: String, trim: true },
  invoiceDate: { type: Date, trim: true },
  itemsAmount: { type: Number, trim: true },
  gstAmount: { type: Number, trim: true },
  totalAmount: { type: Number, trim: true },
});

const InventorySchema = new mongoose.Schema({
  sales_order_no: { type: Number, trim: true },
  dispatch_no: { type: Number, trim: true },
  receivedDate: { type: Date, default: Date.now },
  CustomerDetails: CustomerDetailsSchema,
  itemsDetails: ItemsSchema,
  transportDetails: TransportDetailsSchema,
  invoiceDetails: InvoiceDetailsSchema,
});

const retailerinventoryModel = mongoose.model(
  "RetailerInventory",
  InventorySchema
);
export default retailerinventoryModel;
