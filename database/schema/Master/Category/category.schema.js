import mongoose from "mongoose";
import SchemaFunction from "../../../../controllers/HelperFunction/SchemaFunction";
import LogSchemaFunction from "../../../utils/Logs.schema";

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
    created_by: {
      type: {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "user id is required"]
        },
        name: {
          type: String,
          trim: true,
          default: null
        },
        email_id: {
          type: String,
          trim: true,
          validate: {
            validator: function (value) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            message: "invalid email Id"
          }
        },
        employee_id: {
          type: String,
          trim: true,
          required: [true, "employee id is required"]
        },
      },
      required: [true, "created by is required"]
    }
  })
);

CategorySchema.index({ "current_data.category_name": 1 }, { unique: true });

const categoryModel = mongoose.model("category", CategorySchema);
LogSchemaFunction("category", categoryModel)
export default categoryModel;
