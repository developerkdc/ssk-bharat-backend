import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User Id is required"],
  },
  module_type: {
    type: String,
    required: [true, "Module Type is required"],
    enum: ["retailers", "offlinestores", "websites"],
  },
  complaint: {
    type: String,
    required: [true, "complaint is required"],
    maxlength: [1000, "complaint cannot exceed 1000 characters"],
  },
  ticket_status:{
    type: String,
    enum: ["pending", "closed"],
    default:"pending"
  },
  replies: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      type:{
        type: String,
        enum: ["consultant", "user"],
        required:[true,"Type is required"]
      },
      reply: {
        type: String,
        maxlength: [1000, "Reply cannot exceed 1000 characters"],
        default: null,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const TicketModel = mongoose.model("ticket", TicketSchema);
export default TicketModel;
