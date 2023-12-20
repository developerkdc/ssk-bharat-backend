import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: [true, "Category is Required"],
  },
  product_name: {
    type: String,
    min: 2,
    max: 25,
    required: [true, "Product Name is required"],
    unique: true,
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
    minlength: 10,
    maxlength: 100,
  },
  long_description: {
    type: String,
    required: [true, "Long Description is required"],
    minlength: 20,
    maxlength: 500,
  },
  status: { type: Boolean, default: true },
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "units",
    required: [true, "Unit is Required"],
  },
  approver_one: {
    type: {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      name: {
        type: String,
        trim: true,
      },
      email_id: {
        type: String,
        validate: {
          validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: "approver one invalid email Id",
        },
      },
      employee_id: String,
      isApprove: {
        type: Boolean,
        default: false,
      },
    },
    default: null,
  },
  approver_two: {
    type: {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      name: String,
      email_id: {
        type: String,
        validate: {
          validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: "approver two invalid email Id",
        },
      },
      employee_id: String,
      isApprove: {
        type: Boolean,
        default: false,
      },
    },
    default: null,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const productModel = mongoose.model("products", ProductSchema);
export default productModel;
