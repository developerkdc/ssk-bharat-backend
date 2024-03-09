import mongoose from "mongoose";
import LogSchemaFunction from "../../utils/Logs.schema";
import createdBy from "../../utils/createdBy.schema";

const FaqSchema = new mongoose.Schema({
  // portal_type: {
  //   type: String,
  //   required: [true, "Module Type is required"],
  //   enum: ["offlinestore", "retailer", "website"],
  //   default: null,
  // },
  question: {
    type: String,
    required: [true, "Question is required"],
    maxlength: [255, "Question cannot exceed 255 characters"],
  },
  answer: {
    type: String,
    required: [true, "Answer is required"],
    maxlength: [1000, "Answer cannot exceed 1000 characters"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: createdBy,
    required: [true, "created by is required"],
  },
});

const FaqModel = mongoose.model("faq", FaqSchema);

LogSchemaFunction("faq", FaqModel);

export default FaqModel;
