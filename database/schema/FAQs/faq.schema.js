import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema({
  module_type: {
    type: String,
    required: [true, "Module Type is required"],
    enum: ["order"],
  },
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
  created_at:{
    type:Date,
    default:Date.now
  },
  updated_at:{
    type:Date,
    default:Date.now
  },
});

const FaqModel = mongoose.model("faq", FaqSchema);
export default FaqModel;
