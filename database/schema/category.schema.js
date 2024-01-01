import mongoose from "mongoose";
import userAndApprovals from "../utils/approval.schema";

const CategorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    min: 2,
    max: 25,
    required: [true, "Category Name is required"],
    unique: true,
  },
  category_image: {
    type: String,
    required: [true, "Image is required"],
  },
  status: { type: Boolean, default: false },
  show_in_website: { type: Boolean, default: false },
  show_in_retailer: { type: Boolean, default: false },
  show_in_offline_store: { type: Boolean, default: false },
  approver:userAndApprovals,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const categoryModel = mongoose.model("category", CategorySchema);
export default categoryModel;
