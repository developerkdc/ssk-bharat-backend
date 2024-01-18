import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../../utils/Logs.schema";
import createdBy from "../../../utils/createdBy.schema";

const ProductSchema = SchemaFunction(
  new mongoose.Schema({
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
      minlength: 10,
      maxlength: 100,
    },
    long_description: {
      type: String,
      required: [true, "Long Description is required"],
      minlength: 20,
      maxlength: 500,
    },
    hsn_code: {
      type: String,
      required: [true, "Hsn Code is required"],
    },
    gst: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gst",
      required: [true, "GST is required"],
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "units",
      required: [true, "Unit is Required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: createdBy,
      required: [true, "created by is required"]
    }
  })
);

ProductSchema.index({ "current_data.product_name": 1 }, { unique: true });
ProductSchema.index({ "current_data.sku": 1 }, { unique: true });

const productModel = mongoose.model("products", ProductSchema);

// (async function () {
//   await productModel.createCollection();

//   const RedactedUser = mongoose.model('productView', ProductSchema);

//   await RedactedUser.createCollection({
//     viewOn: 'products', // Set `viewOn` to the collection name, **not** model name.
//     pipeline: [
//       {
//         $lookup: {
//           from: 'categories',
//           localField: 'current_data.category',
//           foreignField: '_id',
//           as: 'current_data.category'
//         }
//       }
//     ]
//   })

// })()
LogSchemaFunction("products", productModel);
export default productModel;