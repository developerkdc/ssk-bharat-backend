import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";

const CategorySchema = SchemaFunction(
  new mongoose.Schema({
    category_name: {
      type: String,
      min: 2,
      max: 25,
      required: [true, "Category Name is required"],
      unique: true,
    },
    category_image: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: { type: Boolean, default: false },
    show_in_website: { type: Boolean, default: false },
    show_in_retailer: { type: Boolean, default: false },
    show_in_offline_store: { type: Boolean, default: false },
  })
);

CategorySchema.index({ "current_data.category_name": 1 }, { unique: true });

const categoryModel = mongoose.model("category", CategorySchema);
export default categoryModel;
