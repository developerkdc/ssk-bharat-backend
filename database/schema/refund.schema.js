import mongoose from "mongoose";
import userAndApprovals from "../utils/approval.schema";

const refundSchema = new mongoose.Schema({
  sales_order_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Sales ID is required"],
    ref: "salesorders",
  },
  total_amount:{
    type: Number,
    required: [true, "Refund Amount is required"],
    trim: true,
  },
  refund_amount: {
    type: Number,
    required: [true, "Refunded Amount is required"],
    trim: true,
  },
  transaction_id: {
    type: Number,
    required: [true, "Transaction ID is required"],
    trim: true,
  },
  refund_type: { type: String, required: [true, "Refund Type is required"],enum:["NEFT","RTGS","Cheque"] },
  approver: userAndApprovals,
  order_by: { type: String, required: [true, "Order By is required"] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const refundModel = mongoose.model("refunds", refundSchema);
export default refundModel;
