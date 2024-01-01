import mongoose from "mongoose";
import userAndApprovals from "../../../utils/approval.schema";

const PaymentTermSchema = new mongoose.Schema({
  payment_term_days: {
    type: Number,
    required: [true, "Payment Term Days is required"],
    unique: true,
  },
  approver:userAndApprovals,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const paymentTermDaysModel = mongoose.model("paymenttermdays", PaymentTermSchema);
export default paymentTermDaysModel;
